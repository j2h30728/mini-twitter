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
        primary: "#65C3C8",
        primaryFocus: "#3FACB1",

        primaryContent: "#172337",
        cupcake1: "#EF9FBC",
        cupcake1Focus: "#E45B8C",
        cupcake1Content: "#50001D",
        point: "#EEAF3A",
        pointFocus: "#DA9413",
        pointContent: "#3B2600",

        neutral: "#291334",
        base100: "#FAF7F5",
        base200: "#EFEAE6",
        base300: "#E7E2DF",
        base: "#F5F4F5",
        base1: "#E7E5E4",
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
