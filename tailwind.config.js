// tailwind.config.js
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{vue,js,ts}"],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        // 라이트 모드 기본
        DEFAULT: {
          css: {
            "--tw-prose-body": theme("colors.slate.700"),
            "--tw-prose-headings": theme("colors.slate.900"),
            "--tw-prose-links": theme("colors.sky.600"),
            "--tw-prose-code": theme("colors.sky.700"),
            "--tw-prose-pre-bg": theme("colors.slate.100"),
          },
        },
        // 다크 모드 반전
        invert: {
          css: {
            "--tw-prose-body": theme("colors.slate.200"),
            "--tw-prose-headings": theme("colors.slate.50"),
            "--tw-prose-links": theme("colors.sky.300"),
            "--tw-prose-code": theme("colors.sky.300"),
            "--tw-prose-pre-bg": theme("colors.slate.900"),
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
