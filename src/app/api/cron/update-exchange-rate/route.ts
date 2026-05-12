/**
 * src/app/api/cron/update-exchange-rate/route.ts
 *
 * Vercel Cron Job：每天凌晨 1:00 (UTC+8) 自动拉取最新 CNY→PHP 汇率，
 * 存入 Supabase app_settings 表，供全站价格展示使用。
 *
 * vercel.json 中配置示例：
 * {
 *   "crons": [{
 *     "path": "/api/cron/update-exchange-rate",
 *     "schedule": "0 17 * * *"   <- UTC 17:00 = 北京时间次日 01:00
 *   }]
 * }
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  // 安全校验：Vercel Cron 会在 Header 中带 CRON_SECRET
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. 从 Frankfurter 拉取最新汇率（无需 API Key，完全免费）
    const res = await fetch('https://api.frankfurter.app/latest?from=CNY&to=PHP', {
      next: { revalidate: 0 }, // 禁止 Next.js 缓存，确保拿到最新数据
    });

    if (!res.ok) {
      throw new Error(`Frankfurter API 响应异常: ${res.status}`);
    }

    const data = await res.json();
    const rate: number = data.rates?.PHP;
    const rateDate: string = data.date;

    if (!rate) throw new Error('返回数据中没有 PHP 汇率');

    // 2. 写入 Supabase app_settings 表
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase
      .from('app_settings')
      .upsert(
        {
          key: 'cny_to_php_rate',
          value: String(rate),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );

    if (error) throw new Error(`写入 Supabase 失败: ${error.message}`);

    console.log(`[Cron] 汇率更新成功: 1 CNY = ${rate} PHP (${rateDate})`);

    return NextResponse.json({
      success: true,
      rate,
      rateDate,
      updatedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[Cron] 汇率更新失败:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
