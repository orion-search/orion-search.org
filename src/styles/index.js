import { injectGlobal } from "emotion";

import MatterLight from "../assets/fonts/Matter-Light.otf";
// import MatterMedium from "../assets/fonts/Matter-Medium.otf";
import MatterRegular from "../assets/fonts/Matter-Regular.otf";
import MatterBold from "../assets/fonts/Matter-Bold.otf";
import MatterHeavy from "../assets/fonts/Matter-Heavy.otf";

injectGlobal`
  body {
    margin: 0;
  }

  @font-face {
    font-family: 'Matter';
    font-style: normal;
    font-weight: lighter;
    src: url(${MatterLight}) format('opentype');
  }

  @font-face {
    font-family: 'Matter';
    font-style: normal;
    font-weight: normal;
    src: url(${MatterRegular}) format('opentype');
  }

  @font-face {
    font-family: 'Matter';
    font-style: normal;
    font-weight: bold;
    src: url(${MatterBold}) format('opentype');
  }

  @font-face {
    font-family: 'Matter';
    font-style: normal;
    font-weight: bolder;
    src: url(${MatterHeavy}) format('opentype');
  }

`;

const theme = {
  fonts: {
    regular: "Matter"
  }
};

export default theme;
