---
name: "nextjs-sanity-wp-api"
description: "为 Sanity + Next.js 项目构建 WordPress REST API 兼容层，让 WordPress 生态工具（如 301 写作、SEO 插件）无缝对接 Sanity CMS。当用户需要在 Sanity 项目中模拟 /wp-json/wp/v2 接口时调用。"
---

# Next.js × Sanity → WordPress REST API 兼容层

## 适用场景

已有 Sanity + Next.js 项目，需要兼容 WordPress REST API。常见场景：

- **301 写作 / AI 内容生成工具**：它们通过 `POST /wp-json/wp/v2/posts` 发布文章
- **SEO 插件**：模拟 Yoast/RankMath 的 meta 字段读写
- **其他 WordPress 生态工具**：任何调 WordPress REST API 的外部服务

## 目录结构

```
src/app/api/wp-json/
├── route.ts                             # 根路由（可选）
└── wp/v2/
    ├── utils.ts                         # 公共工具：CORS、categories 共享列表
    ├── route.ts                         # GET /wp-json/wp/v2/ 返回 namespace 信息
    ├── posts/
    │   ├── route.ts                     # GET /posts (列表), POST /posts (创建草稿)
    │   └── [id]/route.ts               # GET/POST /posts/{id} (详情/更新)
    ├── media/
    │   ├── route.ts                     # GET /media (列表+搜索), POST /media (上传)
    │   └── [id]/route.ts               # GET/POST /media/{id} (详情/更新元数据)
    ├── categories/route.ts              # GET /categories (列表), POST (动态创建)
    ├── tags/route.ts                    # GET /tags (列表), POST (动态新增)
    ├── taxonomies/route.ts              # GET /taxonomies
    ├── users/me/route.ts               # GET /users/me (Basic Auth 认证)
    └── plugins/route.ts                 # GET /plugins (模拟激活的插件列表)
```

## 核心原则

### 1. wordpressMediaId 映射机制

WordPress 用自增数字 ID，Sanity 用字符串 `_id`。需要在 **上传图片时** 生成稳定的数字 ID 并写入 Sanity asset：

```typescript
// 从 Sanity _id 生成稳定的数字 ID
function hashString(str: string): number {
  return Math.abs(str.split('').reduce((acc, c) => acc * 31 + c.charCodeAt(0), 0) % 2147483647);
}

// 上传成功后写入
await writeClient.patch(asset._id).set({ wordpressMediaId: hashString(asset._id).toString() }).commit();
```

后续查找全部用 `wordpressMediaId` 字段精准匹配，不要用 hash 遍历。

### 2. Sanity Schema 需要增加的字段

`post` schema（`sanity/schemaTypes/post.ts`）需要：
```
wordpressId: string       # WP 文章 ID
wordpressMediaId: string  # 封面图 WP ID（冗余存储）
htmlContent: text         # AI 生成的原始 HTML
seoTitle: string          # Yoast/RankMath SEO 标题
seoDescription: text      # Yoast/RankMath SEO 描述
tags: string              # 逗号分隔标签
category: string          # 分类名（去掉 options.list 限制，支持动态新增）
mainImage: image          # 封面图 reference
publishedAt: datetime     # 发布时间（决定是否显示在博客列表）
```

## 关键实现细节

### POST /posts/{id} — 更新文章 + 特色图片兜底策略

```typescript
// 特色图片优先级：
//   1. 优先从正文 HTML 中随机选一张 Sanity 图片作为封面
//   2. 正文无 Sanity 图时，才用写作系统传的 featured_media
let mainImageRef = undefined;

// Step 1: 从正文随机选图（避免多篇文章封面雷同）
if (contentHtml) {
  const imgMatches = [...contentHtml.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)];
  if (imgMatches.length > 0) {
    const randomImg = imgMatches[Math.floor(Math.random() * imgMatches.length)];
    const srcUrl = randomImg[1];
    const sanityHashMatch = srcUrl.match(
      /cdn\.sanity\.io\/images\/[^/]+\/[^/]+\/([a-f0-9]+)-\d+x\d+\.[a-z]+/i
    );
    if (sanityHashMatch) {
      const assetByUrl = await client.fetch(
        `*[_type == "sanity.imageAsset" && _id match $pattern][0] { _id }`,
        { pattern: `image-${sanityHashMatch[1]}-*` }
      );
      if (assetByUrl?._id) {
        mainImageRef = { _type: 'image', asset: { _type: 'reference', _ref: assetByUrl._id } };
      }
    }
  }
}

// Step 2: 正文无图时回退到写作系统的 featured_media
if (!mainImageRef && featured_media > 0) {
  const matchedAsset = await client.fetch(
    `*[_type == "sanity.imageAsset" && wordpressMediaId == $mediaId][0] { _id }`,
    { mediaId: featured_media.toString() }
  );
  if (matchedAsset?._id) {
    mainImageRef = { _type: 'image', asset: { _type: 'reference', _ref: matchedAsset._id } };
  }
}
```

**为什么要优先随机选图？** 301 写作系统可能给多篇文章分配相同的 `featured_media` ID（如免版权图库选到同一张"最佳"图）。如果直接用它传的 ID，多篇文章封面全部雷同。从正文中随机选一张 Sanity 图片能保证每篇文章封面都不同。

### GET /posts/{id} — ⚠️ 必须返回真实数据

**绝不能返回假数据！** 301 写作发布后调 `GET /posts/{id}` 验证 `featured_media` 是否 > 0，如果是假数据会让它以为发布失败并重试（造成重复草稿）：

```typescript
const post = await client.fetch(`*[_type == "post" && wordpressId == $id][0]{
  title, "slug": slug.current, htmlContent, category, tags, wordpressId,
  publishedAt, seoTitle, seoDescription,
  "featured_media": coalesce(mainImage.asset->wordpressMediaId, 0)
}`, { id });
```

返回完整的 WP 格式：`{ id, title: { rendered }, content: { rendered }, excerpt: { rendered }, featured_media, categories[], tags[] }`

**⚠️ categories 必须返回数字 ID，不能返回分类名称字符串！**

301 写作的 Python 后端会执行 `int(item)` 遍历返回的 `categories` 数组。如果返回的是名称字符串（如 `"Market Insights"`），会直接抛异常 `invalid literal for int() with base 10`。

```typescript
// utils.ts 中增加名称→ID 的反向查找
export function findCategoryIdByName(name: string): number | undefined {
  return categories.find(c => c.name === name)?.id;
}

// GET /posts/{id} 返回时转换
categories: post.category
  ? [findCategoryIdByName(post.category)].filter(Boolean) as number[]
  : [],
```

**⚠️ featured_media 容错：当 wordpressMediaId 缺失时生成数字 ID**

封面图通过 fallback 逻辑设置后，asset 上可能没有 `wordpressMediaId` 字段。GET 接口不能只依赖 `coalesce(mainImage.asset->wordpressMediaId, 0)`，需要同时获取 `mainImage.asset._ref` 并据此生成稳定的数字 ID：

```typescript
// 查询时同时取 imageRef
const post = await client.fetch(`*[...][0]{
  "featured_media": coalesce(mainImage.asset->wordpressMediaId, 0),
  "imageRef": mainImage.asset._ref
}`, params);

// 简单的 hash 函数
const hashRef = (ref: string): number => {
  let hash = 0;
  for (let i = 0; i < ref.length; i++) {
    hash = ((hash << 5) - hash) + ref.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// 返回时优先 wordpressMediaId，无则用 imageRef hash
const featuredMedia = post.featured_media || (post.imageRef ? hashRef(post.imageRef) : 0);
```

这样即使 cover image 没有 `wordpressMediaId`，301 也能看到 `featured_media > 0`，不会触发"缺少特色图片"拦截。

### GET /media?search= — 分词搜索

301 写作搜图用整句短语（如 `"pickleball paddle edge guard damage"`），需要分词成 OR 条件：

```typescript
const tokens = search.replace(/[^\w\s]/g, ' ').split(/\s+/).filter(t => t.length >= 2);
const clauses = tokens.flatMap(t => [
  `originalFilename match "*${t}*"`,
  `title match "*${t}*"`,
  `altText match "*${t}*"`,
  `description match "*${t}*"`,
]);
queryCondition += ` && (${clauses.join(' || ')})`;
```

### GET /media/{id} — 返回完整数据

必须返回 `source_url`，301 写作需要这个字段来插入图片 `<img>` 标签：

```typescript
const asset = await client.fetch(`*[_type == "sanity.imageAsset" && wordpressMediaId == $id][0]{
  _id, url, originalFilename, title, altText, wordpressMediaId
}`, { id });
return { id, source_url: asset.url, alt_text: asset.altText, title: { rendered: asset.title } };
```

### POST /media — 支持多种上传方式

需要同时支持：
- `multipart/form-data` → 从 `file` 或 `async-upload` 字段提取
- `application/json` → 从 `file`/`data`/`image` 字段提取 base64
- 原始二进制 → 从 `Content-Disposition` 提取文件名

⚠️ Vercel Serverless body 限制 **4.5MB**，确保上传图片不超过此大小。

### categories/route.ts — 必须支持 POST

WordPress 分类可以动态新增，301 写作可能需要创建新分类：

```typescript
export async function POST(request: Request) {
  const body = await request.json();
  const name = body.name;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const id = getNextCategoryId(); // 递增 ID
  categories.push({ id, name, slug, ... });
  return NextResponse.json(cat, { status: 201 });
}
```

### Blog 列表页过滤草稿

```typescript
// ✅ 只显示有 publishedAt 的文章
const posts = await client.fetch(`*[_type == "post" && defined(slug.current) && defined(publishedAt)] | order(publishedAt desc) {...}`);

// ❌ 不要用 slug match "draft-*" 过滤，301 写作的 slug 不包含 draft 前缀
```

### CORS 响应头

所有端点需要返回 CORS 头：

```typescript
export function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Disposition, X-WP-Nonce',
  };
}
```

## 环境变量

```bash
# .env.local (本地) / Vercel Environment Variables (生产)
WP_MOCK_USERNAME=xxx          # 301写作 Basic Auth 用户名
WP_MOCK_PASSWORD=xxx          # 301写作 Basic Auth 密码
SANITY_API_TOKEN=xxx          # Sanity 写入权限 token
NEXT_PUBLIC_SITE_URL=https://example.com
NEXT_PUBLIC_SANITY_PROJECT_ID=xxx
```

## 经验教训

| 陷阱 | 后果 | 正确做法 |
|------|------|---------|
| GET /posts/{id} 返回假数据 | 301 发布后验证失败 → 重试 → 重复创建草稿 | 必须从 Sanity 查询真实数据 |
| POST /posts 始终设 publishedAt | 空草稿显示在博客列表页 | 仅 status=publish 时才设 |
| GET /media/{id} 无 source_url | 301 拿不到图片 URL → 文章无图 | 返回完整 asset 数据 |
| media 搜索用整句精确匹配 | 所有图片搜索枯竭 | 分词 OR 匹配 + 多字段搜索 |
| categories 无 POST 支持 | 301 创建新分类失败 → 发布拦截 | 支持动态新增分类 |
| Sanity category 字段有 options.list 限制 | 动态分类写入时被拒 | 去掉 options.list |
| 旧域名图片 URL 替换逻辑 | 新项目不需要 | 直接删除，存储原始 HTML |
| GET /posts/{id} 的 categories 返回名称字符串 | 301 Python 后端 `int("Market Insights")` 抛异常 | 返回数字 ID，用 `findCategoryIdByName` 转换 |
| 301 给多篇文章传相同 `featured_media` ID | 多篇文章封面完全雷同 | POST 时优先从正文随机选图作为封面 |
| `mainImage` 存在但 `wordpressMediaId` 为空 | GET 返回 `featured_media: 0`，301 拦截发布 | 同时取 `imageRef`，用 hash 生成数字 ID 兜底 |
