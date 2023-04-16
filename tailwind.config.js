module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontSize: {
      sm: "0.8rem",
      base: "1rem",
      lg: "1.2rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.953rem",
      "4xl": "2.441rem",
      "5xl": "3.052rem",
    },
    extend: {
      colors: {
        primaryLight: "#b2f5f7",
        primary: "#65C3C8",
        primaryFocus: "#3FACB1",
        primaryDark1: "#19797d",
        primaryDark2: "#1b3b3d",

        primaryContent: "#172337",
        cupcake1: "#EF9FBC",
        cupcake1Focus: "#E45B8C",
        cupcake1Content: "#50001D",

        pointLight1: "#ffe0a6",
        pointLight2: "#f7dba6",
        pointLight3: "#f7c972",
        point: "#EEAF3A",
        pointFocus: "#DA9413",
        pointDark1: "#6e4d10",
        pointDark2: "#917b50",
        pointDark3: "#63563c",
        pointDark4: "#403a2e",
        pointContent: "#3B2600",

        neutral: "#291334",
        base100: "#FAF7F5",
        base200: "#EFEAE6",
        base300: "#E7E2DF",
        base: "#F5F4F5",
        base1: "#E7E5E4",
        base2: "#A1A1AA",
        base3: "#71717A",

        baseContent: "#291334",
        info: "#3ABFF8",
        success: "#36D399",
        warning: "#FBBD23",
        error: "#F87272",
      },
    },
  },
  plugins: [],
};
