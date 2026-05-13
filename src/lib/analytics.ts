/**
 * Analytics Utility — 广告追踪事件集中管理
 *
 * ⚠️ 使用前必须：
 *  1. 在 layout.tsx 中替换 YOUR_PIXEL_ID 为真实 Facebook Pixel ID
 *  2. 在 layout.tsx 中替换 G-XXXXXXXXXX 为真实 GA4 Measurement ID（可选）
 */

// ─── Type Declarations ───────────────────────────────────────────────────────

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

// ─── Facebook Pixel ───────────────────────────────────────────────────────────

/** 内部安全调用 fbq，防止未加载时报错 */
function fbq(...args: unknown[]) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(...args);
  }
}

/** 内部安全调用 gtag，防止未加载时报错 */
function gtag(...args: unknown[]) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(...args);
  }
}

// ─── 标准 Facebook Pixel 事件 ─────────────────────────────────────────────────

/**
 * 用户点击任意 CTA 按钮（Get Quote / WhatsApp / Get Wholesale Price）
 * 对应 Facebook 标准事件：InitiateCheckout
 * 用途：识别高意图用户，用于再营销受众
 */
export function trackCTAClick(source: string) {
  fbq("track", "InitiateCheckout", { content_name: source });
  gtag("event", "cta_click", { event_category: "engagement", event_label: source });
}

/**
 * 用户成功打开 WhatsApp（真实询盘行为）
 * 对应 Facebook 标准事件：Contact
 * 用途：作为转化目标，训练 Facebook 算法
 */
export function trackWhatsAppOpen(source: string) {
  fbq("track", "Contact", { content_name: source });
  gtag("event", "whatsapp_open", { event_category: "conversion", event_label: source });
}

/**
 * 用户点击邮件链接
 * 对应 Facebook 标准事件：Contact
 */
export function trackEmailClick(source: string) {
  fbq("track", "Contact", { content_name: `email_${source}` });
  gtag("event", "email_click", { event_category: "conversion", event_label: source });
}

/**
 * 用户浏览到关键内容板块（ProductShowcase, PriceAdvantage 等）
 * 对应 Facebook 标准事件：ViewContent
 * 用途：了解内容吸引力，构建中间漏斗受众
 */
export function trackSectionView(sectionName: string) {
  fbq("track", "ViewContent", { content_name: sectionName });
  gtag("event", "section_view", { event_category: "engagement", event_label: sectionName });
}

// ─── B2C 电商 Facebook Pixel 核心漏斗事件 ─────────────────────────────────────

/**
 * 1. 查看商品详情 (ViewContent)
 */
export function trackProductView(productName: string, price: number, currency = 'PHP') {
  fbq("track", "ViewContent", {
    content_name: productName,
    value: price,
    currency: currency,
    content_type: 'product'
  });
  gtag("event", "view_item", {
    currency: currency,
    value: price,
    items: [{ item_name: productName, price: price }]
  });
}

/**
 * 2. 加入购物车 (AddToCart)
 */
export function trackAddToCart(productName: string, price: number, currency = 'PHP') {
  fbq("track", "AddToCart", {
    content_name: productName,
    value: price,
    currency: currency,
    content_type: 'product'
  });
  gtag("event", "add_to_cart", {
    currency: currency,
    value: price,
    items: [{ item_name: productName, price: price }]
  });
}

/**
 * 3. 发起结账 (InitiateCheckout)
 */
export function trackCheckout(totalValue: number, currency = 'PHP') {
  fbq("track", "InitiateCheckout", {
    value: totalValue,
    currency: currency
  });
  gtag("event", "begin_checkout", {
    currency: currency,
    value: totalValue
  });
}

/**
 * 4. 购买成功 (Purchase)
 */
export function trackPurchase(totalValue: number, orderId: string, currency = 'PHP') {
  fbq("track", "Purchase", {
    value: totalValue,
    currency: currency,
    order_id: orderId
  });
  gtag("event", "purchase", {
    currency: currency,
    value: totalValue,
    transaction_id: orderId
  });
}

// ─── 遗留的 B2B 事件 & 自定义事件 ────────────────────────────────────────────────────


/**
 * 滚动深度追踪（25% / 50% / 75% / 100%）
 * 对应 Facebook 自定义事件：ScrollDepth
 * 用途：判断用户是否真正阅读了页面内容
 */
export function trackScrollDepth(percentage: 25 | 50 | 75 | 100) {
  fbq("trackCustom", `ScrollDepth${percentage}`);
  gtag("event", "scroll_depth", {
    event_category: "engagement",
    event_label: `${percentage}%`,
    value: percentage,
  });
}

/**
 * 用户停留时间追踪（10s / 30s / 60s 节点）
 * 用途：筛选真实阅读用户 vs 跳出用户
 */
export function trackTimeOnPage(seconds: 10 | 30 | 60) {
  fbq("trackCustom", `TimeOnPage_${seconds}s`);
  gtag("event", "time_on_page", {
    event_category: "engagement",
    event_label: `${seconds}s`,
    value: seconds,
  });
}
