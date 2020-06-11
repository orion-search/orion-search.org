/** @jsx jsx */
import { ThemeProvider } from "emotion-theming";
import { Global, css, jsx } from "@emotion/core";
import GlobalStyles from "../src/styles/global";

import theme from "../src/styles";

const ThemeDecorator = (storyFn) => (
  <ThemeProvider theme={theme}>
    <Global
      styles={css`
        ${GlobalStyles}

        body {
          margin: 10px;
        }
      `}
    />
    {storyFn()}
  </ThemeProvider>
);

export default ThemeDecorator;
