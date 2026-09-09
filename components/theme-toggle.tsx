"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-xl border border-border/60 bg-card/40 backdrop-blur-md flex items-center justify-center text-muted-foreground opacity-50">
        <Sun className="h-4 w-4" />
      </div>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative h-9 w-9 rounded-xl border border-border/70 bg-card/60 backdrop-blur-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/10 shadow-xs hover:shadow-md hover:shadow-primary/10 active:scale-90 transition-all duration-300 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40"
      aria-label="Cambiar tema de color"
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {/* Sun icon for light mode */}
      <Sun
        className={`h-4 w-4 text-amber-500 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isDark
            ? "-rotate-90 scale-0 opacity-0 pointer-events-none absolute"
            : "rotate-0 scale-100 opacity-100"
        }`}
      />

      {/* Moon icon for dark mode */}
      <Moon
        className={`h-4 w-4 text-purple-400 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0 pointer-events-none absolute"
        }`}
      />
    </button>
  )
}
