import React from 'react';

export const ElectraHero: React.FC = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black font-['Readex_Pro',sans-serif]">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/poster.jpg"
      >
        <source src="/bg-video.mp4" type="video/mp4" />
      </video>

      {/* Floating Pill Navbar */}
      <nav className="absolute z-20 px-6 md:px-10 pt-6 top-0 left-0 right-0 flex items-center justify-between gap-4">
        {/* Left Pill - Logo & Brand */}
        <div className="flex items-center gap-2 bg-neutral-900/90 backdrop-blur rounded-full pl-4 pr-6 py-3">
          <svg
            className="w-5 h-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <span className="text-white text-sm font-normal tracking-tight">electra</span>
        </div>

        {/* Center Pill (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-1 bg-neutral-900/90 backdrop-blur rounded-full px-3 py-2">
          <a
            href="#lighting"
            className="text-neutral-300 hover:text-white transition-colors text-sm px-5 py-2 rounded-full"
          >
            lighting
          </a>
          <a
            href="#switches"
            className="text-neutral-300 hover:text-white transition-colors text-sm px-5 py-2 rounded-full"
          >
            switches
          </a>
          <a
            href="#sockets"
            className="text-neutral-300 hover:text-white transition-colors text-sm px-5 py-2 rounded-full"
          >
            sockets
          </a>
          <a
            href="#projects"
            className="text-neutral-300 hover:text-white transition-colors text-sm px-5 py-2 rounded-full"
          >
            projects
          </a>
        </div>

        {/* Right Button */}
        <button className="bg-white text-black text-sm font-normal rounded-full px-6 py-3 hover:bg-neutral-200 transition-colors">
          shop now
        </button>
      </nav>

      {/* Foreground Content Wrapper */}
      <div className="relative h-full w-full z-10">
        {/* Three Giant Staggered Headline Words */}
        <h1 className="hero-title absolute text-white font-medium text-[14vw] md:text-[13vw] left-4 md:left-10 top-[18%] select-none">
          power
        </h1>
        <h1 className="hero-title absolute text-white font-medium text-[14vw] md:text-[13vw] right-4 md:right-10 top-[38%] select-none">
          every
        </h1>
        <h1 className="hero-title absolute text-white font-medium text-[14vw] md:text-[13vw] left-[18%] md:left-[28%] top-[58%] select-none">
          space
        </h1>

        {/* Description Paragraph */}
        <p className="absolute left-6 md:left-10 top-[46%] max-w-[260px] text-[15px] leading-snug text-white/90">
          premium electrical solutions, designer switches, elegant lighting, and reliable installations for every modern home and commercial space.
        </p>

        {/* Stat Block — Top-Right */}
        <div className="absolute right-6 md:right-24 top-[14%] flex flex-col items-end">
          <div className="flex items-center gap-3 justify-end">
            <div className="hidden md:block h-px w-24 bg-white/40 rotate-[20deg]" />
            <span className="text-4xl md:text-5xl font-medium tracking-tight text-white">+500</span>
          </div>
          <p className="text-xs md:text-sm text-white/70 mt-1 text-right">lighting products</p>
        </div>

        {/* Stat Block — Bottom-Left */}
        <div className="absolute left-6 md:left-20 bottom-20 md:bottom-24 flex flex-col items-start">
          <div className="flex items-center gap-3">
            <span className="text-4xl md:text-5xl font-medium tracking-tight text-white">+50</span>
            <div className="hidden md:block h-px w-24 bg-white/40 rotate-[-20deg]" />
          </div>
          <p className="text-xs md:text-sm text-white/70 mt-1">trusted brands</p>
        </div>

        {/* Stat Block — Bottom-Right */}
        <div className="absolute right-6 md:right-20 bottom-16 md:bottom-20 flex flex-col items-end">
          <div className="flex items-center gap-3 justify-end">
            <div className="hidden md:block h-px w-24 bg-white/40 rotate-[-20deg]" />
            <span className="text-4xl md:text-5xl font-medium tracking-tight text-white">+10k</span>
          </div>
          <p className="text-xs md:text-sm text-white/70 mt-1 text-right">successful installations</p>
        </div>
      </div>

      {/* Bottom Gradient Overlay */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-black" />
    </section>
  );
};

export default ElectraHero;
