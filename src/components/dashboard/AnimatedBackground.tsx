'use client';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/50">
      {/* Gradient Mesh Blobs */}
      <div className="absolute inset-0">
        {/* Primary Blob - Blue */}
        <div
          className="absolute top-0 -left-4 w-[500px] h-[500px] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"
          style={{ animationDuration: '10s' }}
        />

        {/* Secondary Blob - Violet */}
        <div
          className="absolute top-0 -right-4 w-[500px] h-[500px] bg-violet-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"
          style={{ animationDuration: '12s' }}
        />

        {/* Tertiary Blob - Pink */}
        <div
          className="absolute -bottom-8 left-20 w-[500px] h-[500px] bg-pink-400/15 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"
          style={{ animationDuration: '14s' }}
        />
      </div>

      {/* Floating Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, #0f172a 1px, transparent 1px),
              linear-gradient(to bottom, #0f172a 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
            animation: 'grid-move 20s ease-in-out infinite'
          }}
        />
      </div>

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-white/50 to-white/80" />

      {/* Noise Texture (subtle) */}
      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />

      {/* Spotlight Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-blue-500/10 via-violet-500/5 to-transparent blur-3xl" />
    </div>
  );
}
