import { extendTheme } from "@chakra-ui/react";
import "@fontsource/roboto";

const fontStyles = {
  roboto: `"Roboto", sans-serif`,
};

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};

const fonts = {
  roboto: fontStyles.roboto,
};

const breakpoints = {
  exS: "22em",
  sm: "30em",
  md: "48.1em",
  lg: "76em",
  xl: "1440px",
  "2xl": "1660px",
  "3xl": "1860px",
};

const components = {
  Button: {
    variants: {
      "learn-more": {
        height: "44px",
        fontFamily: fontStyles.roboto,
        fontWeight: 500,
        fontSize: "14px",
        lineHeight: "38px",
        textAlign: "center",
        textTransform: "uppercase",
        color: "#606668",
        borderRadius: "4px",
        bg: "#FFFFFF",
        px: "20px",
      },
    },
  },
};

export const theme = extendTheme({ fonts, colors, components, breakpoints });