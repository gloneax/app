// src/components/Logo.tsx
import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* High-Contrast Favicon-Optimized Vector Icon */}
      <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-slate-950 text-white shadow-sm shrink-0 transition-transform hover:scale-105 overflow-hidden ring-1 ring-slate-800">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1"
        >
          <defs>
            {/* Clip path matching the exact outer boundary of the white circle (r = 40) */}
            <clipPath id="outerCircleClip">
              <circle cx="50" cy="50" r="40" />
            </clipPath>
          </defs>

          {/* Outer Globe Ring (Inner Radius: 32, Outer Radius: 40) */}
          <circle
            cx="50"
            cy="50"
            r="36"
            stroke="#f8fafc"
            strokeWidth="8"
          />

          {/* Left Half Horizontal Axis (White, Thickness = 8px) */}
          <line
            x1="14"
            y1="50"
            x2="50"
            y2="50"
            stroke="#f8fafc"
            strokeWidth="8"
            strokeLinecap="butt"
          />

          {/* Right Half Horizontal Axis (Red, Thickness = 12px = 1.5x White) */}
          {/* Clipped to the outer circle to guarantee a perfect curved finish on the right */}
          <g clipPath="url(#outerCircleClip)">
            <line
              x1="50"
              y1="50"
              x2="92"
              y2="50"
              stroke="#f43f5e"
              strokeWidth="12"
              strokeLinecap="butt"
            />
          </g>

          {/* High-Visibility Red Hazard Pulse Alert Marker */}
          <circle cx="72" cy="22" r="12" fill="#f43f5e" />
          <circle cx="72" cy="22" r="5" fill="#ffffff" />
        </svg>
      </div>

      {/* Typography Brand Name: gloneax */}
      {showText && (
        <div className="flex flex-col leading-none group-data-[state=collapsed]:hidden overflow-hidden">
          <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-100 font-sans whitespace-nowrap">
            gloneax
          </span>
          <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1 whitespace-nowrap">
            Hazard Intelligence
          </span>
        </div>
      )}
    </div>
  );
}