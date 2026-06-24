"use client";

export function VideoBackground() {
  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden">
      {/* 60fps Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity duration-1000"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Awwwards Style Overlay - Soft Dark Mask */}
      <div className="absolute inset-0 bg-[#0A0A0C]/50 mix-blend-overlay" />
      
      {/* Subtle Grain Overlay for texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
