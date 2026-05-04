'use client';

import React from 'react';

export default function VRTourPage() {
  return (
    // 使用 100dvh 确保在手机浏览器（如 Safari）上下滑动时，高度自适应，不会出现滚动条错位
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#09090b]">
      {/* 嵌入 1688 VR 页面 */}
      <iframe
        className="absolute inset-0 w-full h-full border-none"
        src="https://air.1688.com/pages/vr_viewer/vr_hall/dq193oei7/index.html?__pageId__=1247378&wh_pid=1247378&wvUseWKWebView=true&__existtitle__=1&xrBizCode=pmAuthentication&previewToken=c4222f843c8744fc8bd69f8accdff72f&sellerLoginId=lidu363636888"
        allowFullScreen
        allow="autoplay; fullscreen; xr-spatial-tracking"
        referrerPolicy="no-referrer"
      />

      {/* 左上角品牌覆盖 - 响应式：手机端较小，PC端稍大 */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10 pointer-events-auto flex items-center justify-center px-4 py-2 md:px-5 md:py-2.5 bg-[#09090b]/90 backdrop-blur-sm border border-[#39FF14]/20 rounded-lg shadow-lg">
        <span className="text-white font-extrabold text-xs md:text-sm tracking-wide">
          DJW Pickleball
        </span>
      </div>

      {/* 底部实色遮罩条 - 响应式高度 + 适配 iPhone 底部小黑条 (safe-area) */}
      <div 
        className="absolute bottom-0 left-0 w-full z-10 pointer-events-auto bg-[#09090b] border-t border-white/5 flex items-center justify-center transition-all"
        style={{ 
          // 基础高度 90px，加上 iOS 底部的安全距离，防止按钮被 iPhone 底部横条遮挡
          height: 'calc(90px + env(safe-area-inset-bottom))',
          paddingBottom: 'env(safe-area-inset-bottom)'
        }}
      >
        {/* Neon 风格联系按钮 - 响应式：手机端适中，PC端更大 */}
        <button 
          onClick={() => alert('这里可以接入你的 Contact 表单或邮箱弹窗！')}
          className="px-6 py-3 md:px-10 md:py-4 bg-[#39FF14] text-black rounded-full font-black text-sm md:text-base uppercase tracking-wider shadow-[0_0_20px_rgba(57,255,20,0.2)] hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:-translate-y-1 transition-all duration-300"
        >
          Contact OEM Factory
        </button>
      </div>
    </div>
  );
}
