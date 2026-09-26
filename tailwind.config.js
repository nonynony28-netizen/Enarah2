/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', 'Tahoma', 'Arial', 'sans-serif'],
        arabic: ['"IBM Plex Sans Arabic"', 'Tahoma', 'Arial', 'sans-serif'],
        latin: ['Inter', 'Arial', 'sans-serif'],
        inter: ['Inter', 'Arial', 'sans-serif'],
        cairo: ['"IBM Plex Sans Arabic"', 'Tahoma', 'Arial', 'sans-serif'],
        tajawal: ['"IBM Plex Sans Arabic"', 'Tahoma', 'Arial', 'sans-serif'],
      },
      fontWeight: {
        regular: '400',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '700',
        black: '700',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        darkblue: {
          DEFAULT: "#0a1628",
          light: "#111d32",
          lighter: "#1a2a42",
        },
        gold: {
          DEFAULT: "#d4a017",
          light: "#e8c766",
          dark: "#a67c00",
        },
        'brand-blue': {
          DEFAULT: "var(--brand-blue, #2563eb)",
          hover: "var(--brand-blue-hover, #1d4ed8)",
          active: "var(--brand-blue-active, #1e40af)",
          light: "var(--brand-blue-light, #eff6ff)",
          soft: "var(--brand-blue-soft, #dbeafe)",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        subtle: "0 6px 24px rgba(15, 23, 42, 0.06)",
        card: "0 4px 20px -2px rgba(15, 23, 42, 0.05)",
        deeper: "0 12px 32px rgba(15, 23, 42, 0.08)",
        glow: "0 0 20px rgba(212, 160, 23, 0.3)",
        "glow-lg": "0 0 40px rgba(212, 160, 23, 0.4)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212, 160, 23, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(212, 160, 23, 0.6)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
