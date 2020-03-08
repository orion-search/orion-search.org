import { injectGlobal } from "emotion";

import MatterLight from "../assets/fonts/Matter-Light.otf";
import MatterRegular from "../assets/fonts/Matter-Regular.otf";
import MatterBold from "../assets/fonts/Matter-Bold.otf";
import MatterHeavy from "../assets/fonts/Matter-Heavy.otf";

import theme from ".";

export default injectGlobal`

@font-face {
  font-family: 'Matter';
  font-style: normal;
  src: url(${MatterLight}) format('opentype') font-weight-lighter,
  url(${MatterRegular}) format('opentype') font-weight-normal,
  url(${MatterBold}) format('opentype') font-weight-bold,
  url(${MatterHeavy}) format('opentype') font-weight-bolder;
}

html {
  background: ${theme.colors.black} !important;
}

body {
  margin: 0;
  color: ${theme.colors.white};
  font-family: "Matter",
  // font-weight: lighter;
}

p {
  font-size: ${theme.type.sizes.normal};
  line-height: 1.35rem;
}

 @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }


`;
