"use client"

import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  className?: string
  iconOnly?: boolean
  showBadge?: boolean
  asLink?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "auto" | "light" | "dark" | "white"
}

export function Logo({
  className = "",
  iconOnly = false,
  showBadge = false,
  asLink = true,
  size = "md",
  variant = "auto",
}: LogoProps) {
  const heights = {
    sm: "h-7",
    md: "h-8.5",
    lg: "h-11",
  }

  const iconHeights = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-11 w-11",
  }

  const content = iconOnly ? (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <Image
        src="/logo-icon.png"
        alt="PagoPing"
        width={44}
        height={44}
        className={`${iconHeights[size]} object-contain transition-transform duration-300 group-hover:scale-105`}
        priority
      />
      {showBadge && (
        <div className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </div>
      )}
    </div>
  ) : (
    <div className={`inline-flex items-center gap-2 group ${className}`}>
      <div className="relative flex items-center">
        {/* If forced to dark or white (e.g. inside dark purple containers) */}
        {variant === "dark" && (
          <Image
            src="/logo-dark.png"
            alt="PagoPing"
            width={180}
            height={44}
            className={`${heights[size]} w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]`}
            priority
          />
        )}

        {variant === "white" && (
          <Image
            src="/logo-white.png"
            alt="PagoPing"
            width={180}
            height={44}
            className={`${heights[size]} w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]`}
            priority
          />
        )}

        {variant === "light" && (
          <Image
            src="/logo.png"
            alt="PagoPing"
            width={180}
            height={44}
            className={`${heights[size]} w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]`}
            priority
          />
        )}

        {variant === "auto" && (
          <>
            {/* Light mode: dark Pago + purple Ping */}
            <Image
              src="/logo.png"
              alt="PagoPing"
              width={180}
              height={44}
              className={`${heights[size]} w-auto object-contain dark:hidden transition-transform duration-300 group-hover:scale-[1.02]`}
              priority
            />
            {/* Dark mode: white Pago + bright lilac Ping for high contrast */}
            <Image
              src="/logo-dark.png"
              alt="PagoPing"
              width={180}
              height={44}
              className={`${heights[size]} w-auto object-contain hidden dark:block transition-transform duration-300 group-hover:scale-[1.02]`}
              priority
            />
          </>
        )}
      </div>

      {showBadge && (
        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hidden sm:inline-flex items-center gap-1 -ml-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          En vivo
        </span>
      )}
    </div>
  )

  if (asLink) {
    return (
      <Link href="/" className="inline-flex items-center group">
        {content}
      </Link>
    )
  }

  return content
}
