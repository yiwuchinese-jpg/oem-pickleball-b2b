/**
 * src/app/api/revalidate/route.ts
 *
 * 按需重新验证（On-demand ISR revalidation）。
 * 发布/修改一篇 Sanity 文章后调用本接口，立刻让前端对应路径失效并用最新内容重建，
 * 这样新文章「第一时间」就能出现在前端，而不必等 10 分钟 ISR 窗口或重新部署。
 *
 * 两种触发方式：
 *  1) 发布脚本：POST /api/revalidate?secret=XXX  body: {"slug":"my-post"}
 *  2) Sanity Webhook（manage.sanity.io → API → Webhooks）：
 *     URL  = https://pickleoem.com/api/revalidate?secret=XXX
 *     Trigger on: Create / Update / Delete，Filter: _type == "post"
 *     Projection: { "slug": slug.current }
 *
 * 安全：共享密钥 REVALIDATE_SECRET（query ?secret= 或 Authorization: Bearer）。
 */

import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const provided =
    req.nextUrl.searchParams.get('secret') ||
    (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');

  if (!secret || provided !== secret) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  let slug: string | undefined;
  try {
    const body = await req.json();
    slug = body?.slug || body?.slug?.current || undefined;
  } catch {
    // no body / not JSON — still revalidate the listing
  }

  // 列表页 + 首页（如展示最新文章）+ sitemap 始终刷新
  revalidatePath('/blog');
  revalidatePath('/');
  revalidatePath('/sitemap.xml');
  // 命中的具体文章页
  if (slug) revalidatePath(`/blog/${slug}`);

  // IndexNow：把变更的 URL 即时推送给 Bing / Yandex（Google 不支持 IndexNow）
  let indexnow: string | null = null;
  // IndexNow key 是公开值（验证文件 /<key>.txt），硬编码兜底，无需额外配置环境变量
  const key = process.env.INDEXNOW_KEY || '5fe8958d1fb3dc72823fa450e4c44c5c';
  if (key) {
    const base = 'https://pickleoem.com';
    const urlList = [`${base}/blog`, ...(slug ? [`${base}/blog/${slug}`] : [])];
    try {
      const r = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          host: 'pickleoem.com',
          key,
          keyLocation: `${base}/${key}.txt`,
          urlList,
        }),
      });
      indexnow = `${r.status}`;
    } catch {
      indexnow = 'error';
    }
  }

  return NextResponse.json({
    revalidated: true,
    slug: slug ?? null,
    indexnow,
    now: Date.now(),
  });
}
