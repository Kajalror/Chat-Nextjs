import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontSize:{
      "heading1-bold":[
        "36px",
        {
          lineHeight:"100%",
          fontWeight:"700",
        }
      ],
      "heading2-bold":[
        "30px",
        {
          lineHeight:"140%",
          fontWeight:"700",
        }
      ],
      "heading3-bold":[
        "24px",
        {
          lineHeight:"140%",
          fontWeight:"700",
        }
      ],
      "heading4-bold":[
        "20px",
        {
          lineHeight:"140%",
          fontWeight:"700",
        }
      ],
      "body-bold":[
        "18px",
        {
          lineHeight:"140%",
          fontWeight:"700",
        }
      ],
      "body-medium":[
        "18px",
        {
          lineHeight:"140%",
          fontWeight:"500",
        }
      ],      
      "base-bold":[
        "16px",
        {
          lineHeight:"140%",
          fontWeight:"600",
        }
      ],
      "base-medium":[
        "16px",
        {
          lineHeight:"140%",
          fontWeight:"500",
        }
      ],
      "base-light":[
        "16px",
        {
          lineHeight:"140%",
          fontWeight:"400",
        }
      ],
      "small-bold":[
        "14px",
        {
          lineHeight:"140%",
          fontWeight:"600",
        }
      ],
      "small-medium":[
        "14px",
        {
          lineHeight:"140%",
          fontWeight:"500",
        }
      ],
      "subtle-medium":[
        "12px",
        {
          lineHeight:"16px",
          fontWeight:"500",
        }
      ],
    },
    "tiny-medium":[
      "10px",
      {
        lineHeight:"140%",
        fontWeight:"500",
      }
    ],
    "x-small-bold":[
      "7px",
      {
        lineHeight:"9.318",
        fontWeight:"600",
      }
    ],
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "blue-1": "#0A065C",
        "blue-2": "#F5F7FB",
        "blue-3": "#04A1E3",
        "grey-1" : "#737373",
        "grey-2" : "#f0f0f0",
        "grey-3" : "#8B8B8B",
        "red-1": "#FF5252",
        "purple-1" : "#C6D4FF",
        "purple-2" : "#4D426D",
        "green-1" : "#13E0E0",
        "pink-1": "#FDDAD6",
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
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
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
    },
  },
  plugins: [],
}
export default config;
