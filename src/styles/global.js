import MatterLight from "../assets/fonts/Matter-Light.woff2";
import MatterRegular from "../assets/fonts/Matter-Regular.woff2";
import MatterBold from "../assets/fonts/Matter-Bold.woff2";
import MatterHeavy from "../assets/fonts/Matter-Heavy.woff2";

import theme from ".";

export default `
@font-face {
  font-family: 'Matter';
  font-style: normal;
  src: url(${MatterRegular}) format('woff2');
}

@font-face {
  font-family: 'Matter';
  font-style: normal;
  font-weight: 300;
  src: url(${MatterLight}) format('woff2');
}

@font-face {
  font-family: 'Matter';
  font-style: normal;
  font-weight: 700;
  src: url(${MatterBold}) format('woff2');
}

@font-face {
  font-family: 'Matter';
  font-style: normal;
  font-weight: 800;
  src: url(${MatterHeavy}) format('woff2');
}

body {
  margin: 0;
  background-color: ${theme.colors.black};
  color: ${theme.colors.white};
  font-family: "Matter", "Helvetica Neue", "Helvetica",  sans-serif;
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

a {
  text-decoration: none;
}
`;
