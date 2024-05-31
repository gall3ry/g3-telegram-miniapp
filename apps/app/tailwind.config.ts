import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-kanit)", ...fontFamily.sans],
      },
    },
    container: {
      center: true,
      screens: {
        sm: "448px",
      },
    },
  },
  plugins: [],
} satisfies Config;
