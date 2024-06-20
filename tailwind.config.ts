/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  theme: {
    backgroundSize: {
      auto: "auto",
      cover: "cover",
      contain: "contain",
      100: "100%",
      80: "80%"
    },
    backgroundPosition: {
      bottom: "bottom",
      "bottom-32": "center bottom 8rem",
      center: "center",
      left: "left",
      "left-bottom": "left bottom",
      "left-top": "left top",
      right: "right",
      "right-bottom": "right bottom",
      "right-top": "right top",
      top: "top",
      "top-4": "center top 8rem"
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",

      /* Starknet-specific colors */
      background: "#000",
      card: "#15132A",
      popover: "#100D19",
      input: "#110F21",
      secondary: "#667085",
      "secondary-dark": "#262B3E",
      "secondary-foreground": "#98A2B3",
      border: "#3A365C",
      "border-dark": "#272B40",
      foreground: "#EEEEEE",
      "muted-foreground": "#211E3C",
      primary: {
        primary: "#EF6ABA",
        button: "#2450EE",
        color: "#000000",
        "modal-overlay": "rgba(0, 0, 0, 0.7)",
        600: "#E04F16"
      },
      accent: "#F396CE",
      destructive: "#F04438",
      "destructive-foreground": "#FDFDFE",
      "dark-2": "#1D1D1D",
      gradient: {
        default: { start: "#1D5CFF", mid: "#9A41FA", stop: "#D940A4" },
        hover: { start: "#0D49E4", mid: "#6D1BC5", stop: "#911265" },
        active: { start: "#1D5CFF", mid: "#9A41FA", stop: "#D940A4" },
        disabled: { start: "#7BDFFF", stop: "#BC88FF" }
      },

      /* Pre-existing color choices */
      white: colors.white,
      gray: {
        10: "rgba(0, 0, 0, 0.1)",
        20: "#FEFEFE",
        21: "#F2F2F2",
        22: "#EDEDED",
        23: "#E6E6E6",
        24: "#C2C2C2",
        25: "#444343",
        30: "#333333",
        35: "#302E2E",
        40: "#373B46",
        45: "#5C5959",
        50: "#B0B0B0",
        100: "#999999",
        120: "#928D8D",
        150: "#8E8B8B",
        200: "#747474",
        220: "#6F6969",
        250: "#5B5858",
        300: "#474747",
        350: "#898CA9",
        400: "#353535",
        500: "#323232",
        520: "#2F2F2F",
        550: "#2C2C2C",
        575: "#262626",
        600: "#272727",
        "modal-bg": "rgb(39, 49, 56)",
        "modal-main": "rgb(199, 199, 199)",
        "modal-secondary": "rgb(136, 136, 136)",
        "modal-border": "rgba(195, 195, 195, 0.14)",
        "modal-hover": "rgb(16, 26, 32)",
        "notification-border": "#bd1120"
      },
      indigo: colors.indigo,
      red: { ...colors.red, 50: "#FFF1F1", 100: "#F55252", 400: "#E12525" },
      yellow: { ...colors.yellow, 100: "#FFFEF0", 200: "#C58D00" },
      green: { ...colors.green, 300: "#26A650", 400: "#449C1B" },
      pink: { ...colors.pink, 100: "#F7F0FF" },
      purple: {
        ...colors.purple,
        100: "#F7F0FF"
      },
      blue: { ...colors.blue, 200: "#EAF7FF", 300: "#6C66E9", 400: "#524AE7", 500: "#3E35E3" },
      orange: {
        ...colors.orange,
        400: "#FF4F00",
        450: "#F8C110"
      },
      black: colors.black,
      slate: colors.slate
    },
    screens: {
      xs: "475px",
      "8xl": "90rem",
      "9xl": "108rem",
      ...defaultTheme.screens
    },
    extend: {
      backgroundImage: {
        "home-star": "url('/assets/starBg.svg')",
        "home-bg": "url('/assets/homeBg.svg')",
        "dot-pattern": "url('/assets/dotPattern.svg')",
        banner: "url('/assets/banner_background.png')",
        "background-svg": "url('/assets/background.svg')",
        modal:
          "radial-gradient(42.01% 62.48% at 0% 33.7%, rgba(36, 80, 238, 0.15) 0%, rgba(36, 80, 238, 0) 100%), radial-gradient(39.18% 58.28% at 100% 96.82%, rgba(217, 64, 164, 0.13) 0%, rgba(217, 64, 164, 0) 100%), linear-gradient(0deg, #2F2F2F, #2F2F2F)"
      },
      fontFamily: {
        poppins: ["Poppins"],
        inter: ["Inter"],
        plex: ["IBM\\ Plex\\ Sans"],
        quicksand: ["Quicksand"],
        outfit: ["Outfit"]
      },
      minWidth: {
        325: "325px",
        72: "18rem"
      },
      maxWidth: {
        "8xl": "88rem"
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding"
      },
      transitionDuration: {
        10: "10ms"
      },
      transitionDelay: {
        0: "0ms"
      },
      transitionTimingFunction: {
        ease: "cubic-bezier(0.25, 0.1, 0.16, 0.98)"
      },
      zIndex: {
        0: 0,
        10: 10,
        11: 11,
        20: 20,
        30: 30,
        40: 40,
        50: 50,
        25: 25,
        75: 75,
        100: 100,
        9000: 9000,
        auto: "auto"
      },
      keyframes: {
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)"
          },
          "20%": {
            opacity: "0",
            transform: "translateY(25px)"
          },
          "35%": {
            opacity: "0",
            transform: "translateY(20px)"
          },
          "50%": {
            opacity: "0",
            transform: "translateY(15px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "fade-out-down": {
          "0%": {
            opacity: "1",
            transform: "translateY(0)"
          },
          "50%": {
            opacity: "0",
            transform: "translateY(25px)"
          },
          "100%": {
            opacity: "0",
            display: "none",
            transform: "translateY(50px)"
          }
        }
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "fade-out-down": "fade-out-down 1s ease-out"
      }
    },
    boxShadow: {
      sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      "3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
      inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
      room: "0 4px 10px 0 rgba(175, 175, 175, 0.1)",
      button: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
      "primary-modal": "10px 20px 0px #000000",
      "notification-item": "0 0 5px rgba(0, 0, 0, 0.4)",
      "notification-div": "1px 3px 4px rgb(0 0 0 / 20%)",
      none: "none"
    },
    fontSize: {
      xs: ".75rem",
      sm: ".875rem",
      tiny: ".875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem",
      "7xl": "5rem"
    }
  },
  variants: {
    extend: {
      backgroundColor: ["checked", "active", "hover"],
      borderColor: ["checked"]
    }
  },
  plugins: [require("@tailwindcss/forms")]
};
