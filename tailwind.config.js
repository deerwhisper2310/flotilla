import daisyui from "daisyui"
import themes from "daisyui/src/theming/themes"

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {},
    zIndex: {
      none: 0,
      "nav-active": 1,
      "nav-item": 2,
      feature: 3,
      nav: 4,
      popover: 5,
      modal: 6,
      "modal-feature": 7,
      toast: 8,
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        dark: {
          ...themes["dark"],
          primary: "#7161FF",
        },
      },
    ],
  },
}
