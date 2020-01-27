import { injectGlobal } from "emotion";

import MatterLight from "../assets/fonts/Matter-Light.otf";
import MatterRegular from "../assets/fonts/Matter-Regular.otf";
import MatterBold from "../assets/fonts/Matter-Bold.otf";
import MatterHeavy from "../assets/fonts/Matter-Heavy.otf";

import theme from "./";

export default injectGlobal`
  body {
    margin: 0;
    background-color: ${theme.colors.black};
    color: white;
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
