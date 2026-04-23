/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  corePlugins: {
    preflight: false,
  },
  plugins: [require("@tailwindcss/typography")],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'Geist Mono'", "'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      colors: {
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        rule: "rgb(var(--rule) / <alpha-value>)",
        sitebg: "rgb(var(--bg) / <alpha-value>)",
        // legacy aliases kept for resume.astro
        lightModeForeground: "rgb(var(--fg) / <alpha-value>)",
        lightModeForegroundMuted: "rgb(var(--muted) / <alpha-value>)",
        darkModeForeground: "rgb(var(--fg) / <alpha-value>)",
        darkModeForegroundMuted: "rgb(var(--muted) / <alpha-value>)",
      },
    },
  },
};
