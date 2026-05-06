这是一份为你量身定制的从 B2B 纯展示站向 B2C 交易站改造的完整文档。你可以直接将这份文档作为你后续开发、排期以及项目管理的参考标准。

***

# 🚀 网站 B2C 交易化改造项目文档

## 第一部分：业务需求文档 (PRD)

### 1. 项目概述

本项目旨在将现有的 Next.js B2B 展示型网站升级为支持直客下单的 B2C 跨境电商独立站。改造的核心是剥离“静态展示”与“动态交易”，引入独立的后端数据库处理订单流转，打通国际支付（PayPal），并与第三方 ERP 系统对接实现物流履约自动化。

### 2. 核心业务蓝图 (混合架构)

- **内容营销中心 (博客/品牌页)：** 继续由 **Sanity CMS** 驱动，保持极佳的 SEO 结构和内容产出效率。
- **商品与交易中心 (电商核心)：** 由 **Supabase** 接管，处理所有的商品规格、定价、库存、用户购物车以及订单生命周期。
- **支付与履约网关：** 采用 **PayPal 中国企业版** 承担全站跨境收款；履约端通过 **妙手 ERP** 同步订单至 **燕文物流** 进行打单发货。

### 3. 用户旅程与功能模块设计

#### 3.1 浏览与选购模块 (前端展示)

- **商品详情页 (PDP)：** 前端通过 Next.js 从 Supabase 实时拉取商品（如匹克球拍、迪斯科球等）的库存状态与最新价格。Sanity 仅提供商品相关的软文或使用指南链接。
- **购物车 (Cart)：** 支持游客状态下的本地缓存（`localStorage`）。用户可以修改购买数量，系统自动校验 Supabase 中的实时库存防超卖。

#### 3.2 结账与支付模块 (Checkout Flow)

- **收件信息采集：** 结账页需包含完整的国际物流所需字段（国家、州/省、城市、详细地址、邮编、电话、邮箱）。
- **运费试算 (Shipping Calculator)：** 结账时预估运费。现阶段可采用固定重量阶梯表与国家分区计算。
- **PayPal 支付直连：** 嵌入 PayPal JS SDK 按钮，支持用户登录 PayPal 账户支付，或以游客身份直接输入国际信用卡（Visa/MasterCard）完成支付。

#### 3.3 订单履约模块 (Order Fulfillment)

- **订单快照：** 支付成功瞬间，系统必须记录当时的购买单价与运费，生成不可篡改的订单快照。
- **自动化推单：** 订单状态更新为“已支付”后，自动推送到妙手 ERP（可借助自动化工作流工具中转，或直接调用 API）。
- **物流回传：** 在妙手 ERP/燕文端生成面单后，将燕文追踪号 (Tracking Number) 回传至独立站数据库，并触发邮件系统（如通过 Resend 平台）发送发货通知给消费者。

***

## 第二部分：技术架构与实现文档 (TDD)

### 1. 整体技术栈

- **前端与路由调度：** Next.js (App Router 或 Pages Router, 托管于 Vercel)
- **关系型数据库与鉴权：** Supabase (PostgreSQL + Auth + Edge Functions)
- **内容管理系统：** Sanity
- **支付网关：** PayPal REST API (集成 Webhook)
- **API 自动化与 ERP 桥接：** n8n / Zapier (可选，用于连接 Supabase 触发器与妙手 ERP)

### 2. 核心数据库设计 (Supabase SQL 建模)

你需要在 Supabase 的 SQL 编辑器中执行以下基础建表逻辑：

SQL

```
-- 1. 商品表 (Products)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- 以分为单位存储，例如 $19.99 存为 1999，避免浮点数精度问题
  stock_quantity INTEGER DEFAULT 0,
  weight_grams INTEGER DEFAULT 0, -- 燕文计费用
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 订单表 (Orders)
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'processing', 'shipped', 'cancelled');

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paypal_order_id VARCHAR(100) UNIQUE, -- 关联 PayPal 的交易号
  customer_email VARCHAR(255) NOT NULL,
  shipping_address JSONB NOT NULL, -- 结构化存储收件地址
  total_amount INTEGER NOT NULL,
  shipping_fee INTEGER NOT NULL,
  status order_status DEFAULT 'pending',
  tracking_number VARCHAR(100), -- 燕文物流单号
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 订单明细表 (Order Items)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL -- 下单时的快照价格
);

```

### 3. 接口与数据流转设计 (Next.js API Routes)

需要开发以下几个核心的后端 API 端点（Serverless Functions）：

#### `POST /api/checkout/create-order`

- **输入：** 购物车商品 ID 列表、数量、收件地址信息。
- **逻辑：** 1. 查询 Supabase 比对价格和库存。

  2\. 计算总价（商品总价 + 运费）。

  3\. 调用 PayPal REST API `v2/checkout/orders` 创建支付订单。

  4\. 在 Supabase `orders` 表创建一条 `pending` 状态的记录。
- **输出：** 返回 PayPal 的 `orderID` 给前端唤起支付面板。

#### `POST /api/webhooks/paypal`

- **作用：** 接收 PayPal 支付成功的异步通知，是**最核心的安全接口**。
- **逻辑：**
  1. 校验 Webhook 签名的合法性（防止伪造支付成功请求）。
  2. 提取 PayPal `orderID`，在 Supabase 中将其对应的订单状态更新为 `paid`。
  3. 扣减 `products` 表中对应 SKU 的库存。

### 4. 自动化物流履约链路

这一步需要将独立站与妙手 ERP 连接，实现免写代码的“半自动”或“全自动”履约。

- **方案 A (API 直连)：** 写一个 Next.js 脚本监听数据库，当订单状态为 `paid` 时，按照妙手 ERP “自定义店铺”的 API 规范，组装 JSON 数据 POST 过去。
- **方案 B (n8n/Zapier 自动化编排 - 推荐)：** 如果你已经在使用 n8n 或 Zapier 处理其他业务线，这是最高效的做法。
  1. 在 Supabase 中设置一个 Webhook 触发器 (Database Webhooks)。当 `orders` 表的 `status` 变为 `paid` 时，向 n8n/Zapier 发送一个 HTTP POST 请求。
  2. 在 n8n/Zapier 中接收数据（包含客户地址、SKU）。
  3. 配置下一个节点，将数据映射推送到妙手 ERP，或者直接生成特定格式的 CSV 发送至运营邮箱供手动批量导入妙手。

### 5. 环境变量与安全配置 (Vercel)

在上线前，必须在 Vercel 的项目 Settings -> Environment Variables 中配置好以下密钥，**绝对不能将其硬编码到前端代码中**：

**变量名**

**用途**

`NEXT_PUBLIC_SUPABASE_URL`

Supabase 项目地址 (前端可用)

`NEXT_PUBLIC_SUPABASE_ANON_KEY`

Supabase 匿名访问密钥 (前端可用)

`SUPABASE_SERVICE_ROLE_KEY`

**高权限密钥，仅限 Next.js API 环境下使用，用于绕过权限验证更新订单和库存**

`NEXT_PUBLIC_PAYPAL_CLIENT_ID`

PayPal 客户端 ID，用于渲染前端支付按钮

`PAYPAL_CLIENT_SECRET`

PayPal 密钥，仅在服务端生成 Token 和校验 Webhook 时使用

`PAYPAL_WEBHOOK_ID`

用于校验 Webhook 来源的安全 ID

`SANITY_PROJECT_ID`

你的 Sanity 项目 ID

### 6. 开发环境阶段性里程碑排期建议

1. **Phase 1 (数据重构)：** 在 Supabase 中建表，录入产品数据，Next.js 首页与详情页接入 Supabase 数据源（跑通展示）。
2. **Phase 2 (交易打通)：** 完成前端购物车开发，开通 PayPal 沙盒 (Sandbox) 账户，跑通从下单到 Webhook 回调修改订单状态的全流程。
3. **Phase 3 (履约测试)：** 用沙盒测试单触发自动化流程（或 API），验证数据能否成功导入妙手 ERP，并成功获取燕文模拟单号。
4. **Phase 4 (上线部署)：** 切换 PayPal 至生产环境密钥，设置 Vercel 生产环境变量，正式上线 B2C 闭环。

