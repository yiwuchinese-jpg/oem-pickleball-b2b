// 运费计算模块 — 基于国家分区 + 商品总重量的阶梯计费（以分为单位返回）

export interface ShippingZone {
  countries: string[];
  label: string;
  baseRate: number; // 首重费用（分），0-500g
  perKgRate: number; // 超重每 kg 费用（分）
  freeThreshold: number; // 免运费门槛（订单金额，分）
  minDays: number;
  maxDays: number;
}

export const SHIPPING_ZONES: ShippingZone[] = [
  {
    countries: ['US', 'CA'],
    label: 'North America',
    baseRate: 1299, // $12.99
    perKgRate: 500, // $5.00/kg
    freeThreshold: 7500, // $75 免运费
    minDays: 7,
    maxDays: 15,
  },
  {
    countries: ['GB', 'DE', 'FR', 'NL', 'IT', 'ES', 'AU', 'NZ'],
    label: 'Europe & Oceania',
    baseRate: 1499,
    perKgRate: 600,
    freeThreshold: 8000,
    minDays: 10,
    maxDays: 18,
  },
  {
    countries: ['PH', 'SG', 'MY', 'TH', 'ID', 'VN', 'JP', 'KR', 'TW', 'HK'],
    label: 'Asia Pacific',
    baseRate: 799,
    perKgRate: 300,
    freeThreshold: 5000,
    minDays: 5,
    maxDays: 12,
  },
  {
    countries: ['AE', 'SA', 'KW', 'QA', 'BH', 'OM'],
    label: 'Middle East',
    baseRate: 1199,
    perKgRate: 450,
    freeThreshold: 7000,
    minDays: 8,
    maxDays: 15,
  },
];

const DEFAULT_ZONE: ShippingZone = {
  countries: [],
  label: 'Worldwide',
  baseRate: 1699,
  perKgRate: 700,
  freeThreshold: 10000,
  minDays: 12,
  maxDays: 25,
};

/**
 * 计算运费
 * @param countryCode ISO 3166-1 alpha-2 国家代码（如 'US'）
 * @param totalWeightGrams 所有商品总重量（克）
 * @param orderAmountCents 订单商品总额（分）
 * @returns 运费（分）和预计到货天数
 */
export function calculateShipping(
  countryCode: string,
  totalWeightGrams: number,
  orderAmountCents: number
): { fee: number; zone: ShippingZone; isFree: boolean } {
  const zone = SHIPPING_ZONES.find((z) => z.countries.includes(countryCode)) ?? DEFAULT_ZONE;

  if (orderAmountCents >= zone.freeThreshold) {
    return { fee: 0, zone, isFree: true };
  }

  const weightKg = totalWeightGrams / 1000;
  const extraKg = Math.max(0, weightKg - 0.5);
  const fee = zone.baseRate + Math.ceil(extraKg * zone.perKgRate);

  return { fee, zone, isFree: false };
}

/** 将分转为美元字符串，例如 1999 → "$19.99" */
export function formatUSD(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
