import { injectGlobal } from "emotion";
import { css } from "@emotion/core";

// import MatterLight from "../assets/fonts/Matter-Light.otf";
// // import MatterMedium from "../assets/fonts/Matter-Medium.otf";
// import MatterRegular from "../assets/fonts/Matter-Regular.otf";
// import MatterBold from "../assets/fonts/Matter-Bold.otf";
// import MatterHeavy from "../assets/fonts/Matter-Heavy.otf";

// injectGlobal`
//   body {
//     margin: 0;
//     background-color: ${colors.black};
//     color: white;
//   }

//   @font-face {
//     font-family: 'Matter';
//     font-style: normal;
//     font-weight: lighter;
//     src: url(${MatterLight}) format('opentype');
//   }

//   @font-face {
//     font-family: 'Matter';
//     font-style: normal;
//     font-weight: normal;
//     src: url(${MatterRegular}) format('opentype');
//   }

//   @font-face {
//     font-family: 'Matter';
//     font-style: normal;
//     font-weight: bold;
//     src: url(${MatterBold}) format('opentype');
//   }

//   @font-face {
//     font-family: 'Matter';
//     font-style: normal;
//     font-weight: bolder;
//     src: url(${MatterHeavy}) format('opentype');
//   }

// `;

const typeUnit = "rem";
const typeBaseSize = 1;

const spacingUnit = "rem";
const spacingBaseSize = 1;

const typeSize = {
  small: `${typeBaseSize * 0.875}${typeUnit}`,
  normal: `${typeBaseSize}${typeUnit}`,
  large: `${typeBaseSize * 1.125}${typeUnit}`,
  huge: `${typeBaseSize * 1.25}${typeUnit}`
};

const typeStyle = {
  small: css`
    font-size: ${typeSize.small};
    font-weight: normal;
  `,
  normal: css`
    font-size: ${typeSize.normal};
    font-weight: normal;
  `,
  large: css`
    font-size: ${typeSize.large};
    font-weight: normal;
  `,
  huge: css`
    font-size: ${typeSize.huge};
    font-weight: normal;
  `
};

const colors = {
  black: `#0c0c0c`
};

export default {
  colors: {
    ...colors
  },

  type: {
    fonts: {
      regular: "Matter"
    },
    sizes: typeSize,
    style: typeStyle
  },

  spacing: {
    none: 0,
    small: `${spacingBaseSize * 0.5}${spacingUnit}`,
    normal: `${spacingBaseSize}${spacingUnit}`,
    large: `${spacingBaseSize * 1.5}${spacingUnit}`,
    huge: `${spacingBaseSize * 2}${spacingUnit}`
  }
};
