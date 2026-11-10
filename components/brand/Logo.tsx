import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  variant?: "light" | "dark" | "inverted";
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  asLink?: boolean;
}

export function Logo({
  className = "",
  variant = "dark",
  size = "md",
  showTagline = false,
  asLink = true,
}: LogoProps) {
  const sizeMap = {
    sm: { icon: 26, text: "text-lg", dot: "w-1.5 h-1.5" },
    md: { icon: 34, text: "text-2xl", dot: "w-2 h-2" },
    lg: { icon: 42, text: "text-3xl", dot: "w-2.5 h-2.5" },
    xl: { icon: 54, text: "text-4xl", dot: "w-3 h-3" },
  };

  const isLight = variant === "light" || variant === "inverted";
  const textColor = isLight ? "text-white" : "text-brand-dark";
  const mutedTextColor = isLight ? "text-emerald-100" : "text-brand-muted";

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Custom Icon: Minimalist Food Plate with warm meal steam + subtle welcoming smile curve */}
      <svg
        width={sizeMap[size].icon}
        height={sizeMap[size].icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="plateGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#174F38" />
            <stop offset="1" stopColor="#286C4D" />
          </linearGradient>
          <linearGradient id="warmGrad" x1="14" y1="12" x2="34" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F2A65A" />
            <stop offset="1" stopColor="#E08F3F" />
          </linearGradient>
        </defs>

        {/* Outer gentle rim */}
        <circle cx="24" cy="24" r="22" fill={isLight ? "#FFFFFF" : "url(#plateGrad)"} />
        
        {/* Inner plate well */}
        <circle
          cx="24"
          cy="24"
          r="16"
          fill={isLight ? "#174F38" : "#F8F7F1"}
          stroke={isLight ? "#286C4D" : "#E5E3D8"}
          strokeWidth="1.5"
        />

        {/* Subtle warm smile & serving curve inside the plate */}
        <path
          d="M17 25C17 28.866 20.134 32 24 32C27.866 32 31 28.866 31 25"
          stroke={isLight ? "#F2A65A" : "url(#warmGrad)"}
          strokeWidth="2.75"
          strokeLinecap="round"
        />

        {/* Cloche / Steam aroma droplets (homely fresh food indicator) */}
        <path
          d="M20 18C20 16.5 21 15 22 15"
          stroke={isLight ? "#FFFFFF" : "#174F38"}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M27 18C27 16 26 15 25 15"
          stroke={isLight ? "#FFFFFF" : "#174F38"}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Delivery / campus marker dot */}
        <circle cx="24" cy="20" r="2" fill="#F2A65A" />
      </svg>

      {/* Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-center tracking-tight">
          <span className={`font-serif font-bold ${textColor} ${sizeMap[size].text}`}>
            Mess
          </span>
          <span className={`font-sans font-bold text-brand-accent ${sizeMap[size].text}`}>
            Mate
          </span>
          <span className={`rounded-full bg-brand-accent ml-1 ${sizeMap[size].dot}`} />
        </div>
        {showTagline && (
          <span className={`text-[10px] uppercase font-semibold tracking-wider ${mutedTextColor} -mt-1`}>
            Good food. Better days.
          </span>
        )}
      </div>
    </div>
  );

  if (asLink) {
    return (
      <Link href="/" className="group inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}

