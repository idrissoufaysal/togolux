/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sky: {
          50: '#fff8f5',
          100: '#fbddc7',
          200: '#dec1ac',
          300: '#dec1ac',
          400: '#bba08c',
          500: '#4a3728',
          600: '#322214',
          700: '#28180b',
          900: '#221a14',
          950: '#1c1713',
        },
        amber: {
          50: '#ffddb0',
          100: '#fdd7a3',
          200: '#fdd7a3',
          500: '#c5a373',
          600: '#755a30',
          700: '#5b421b',
          900: '#291800',
        },
        stone: {
          50: '#fff8f5',
          100: '#fff1e9',
          200: '#fcebe1',
          300: '#f6e5db',
          400: '#e7d7cd',
          500: '#80756d',
          800: '#382e28',
          900: '#221a14',
          950: '#1c1713',
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: '#fff8f5',
          500: '#4a3728',
          600: '#322214',
          700: '#28180b',
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: '#fff8f5',
          100: '#fff1e9',
          800: '#382e28',
          900: '#221a14',
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          500: '#c5a373',
          600: '#755a30',
        },
        neutral: {
          50: '#fff8f5',
          100: '#fff1e9',
          800: '#382e28',
          900: '#221a14',
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
