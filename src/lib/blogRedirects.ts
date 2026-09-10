// 2026-09-10 同题变体文章合并：变体 slug → 保留篇（keeper）。
// 这些变体是 6–7 月按同一大纲改写的重复文，GSC 全是「Crawled - currently not indexed」；
// 合并后 next.config.ts 发 301，sitemap.ts 不再列出。Sanity 文档保留未删，回滚只需删掉这里的映射。
export const BLOG_REDIRECTS: Record<string, string> = {
  // paddle pricing / hidden costs / FOB quotes
  "pickleball-paddle-pricing-hidden-costs-that-kill-margins": "compare-pickleball-paddle-pricing",
  "pickleball-paddle-pricing-avoid-50k-hidden-cost-trap": "compare-pickleball-paddle-pricing",
  "wholesale-pickleball-paddle-pricing-avoid-hidden-defects": "compare-pickleball-paddle-pricing",
  "pickleball-paddle-pricing-hidden-costs-in-fob-quotes": "compare-pickleball-paddle-pricing",
  "wholesale-pickleball-paddle-pricing": "compare-pickleball-paddle-pricing",
  // pickleball mesh bag durability / failure points
  "pickleball-mesh-bag-3-failure-points-causing-90-of-returns": "pickleball-bag-failures-3-weak-points-costing-you-50k",
  "pickleball-6-pack-mesh-bag": "pickleball-bag-failures-3-weak-points-costing-you-50k",
  "pickleball-mesh-bag-durability-the-hidden-cost-of-cheap-zippers": "pickleball-bag-failures-3-weak-points-costing-you-50k",
  "wholesale-pickleball-mesh-bags-3-failure-points-50k-loss": "pickleball-bag-failures-3-weak-points-costing-you-50k",
  // 36-pack pickleball bucket lid failure / TCO
  "pickleball-36-pack-bucket-lid-failure": "pickleball-36-pack-bucket",
  "pickleball-36-pack-buckets-the-true-cost-of-a-cracked-lid": "pickleball-36-pack-bucket",
  "pickleball-bucket-failures-the-true-cost-of-cheap-lids": "pickleball-36-pack-bucket",
  "pickleball-36-pack-bucket-tco-why-cheap-costs-more": "pickleball-36-pack-bucket",
  "heavy-duty-pickleball-bucket-3-year-lid-guarantee": "pickleball-36-pack-bucket",
  "cheap-pickleball-buckets-hidden-cost-per-bucket": "pickleball-36-pack-bucket",
  // pickleball paddle HS code
  "pickleball-paddle-hs-code": "hs-code-pickleball-paddles",
  // pickleball factory tour
  "pickleball-factory-tour": "request-factory-tour-pickleball",
  "factory-tour-savings-pickleball": "request-factory-tour-pickleball",
  // check whether a paddle is USAPA approved
  "usapa-approved-paddle-eligibility-check": "check-usapa-approved-paddle",
  // how to choose / vet a pickleball OEM manufacturer
  "pickleball-oem-manufacturer": "pickleball-oem-factory-vetting",
  // pickleball paddle edge guard peeling / loose repair
  "edge-guard-peeling-fix": "loose-pickleball-paddle-edge-guard-repair",
  // pickleball ball machine OEM sourcing
  "pickleball-ball-machine-oem": "pickleball-ball-machine-oem-sourcing",
};
export const REDIRECTED_SLUGS = new Set(Object.keys(BLOG_REDIRECTS));
