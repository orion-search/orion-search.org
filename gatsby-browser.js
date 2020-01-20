import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import { client } from "./src/utils/apollo";
import { ThemeProvider } from "emotion-theming";
import { Global } from "@emotion/core";

import theme from "./src/styles";

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <Global
        styles={{
          body: {
            fontFamily: "Matter",
            overscrollBehavior: "none"
          }
        }}
      />
      {element}
    </ThemeProvider>
  </ApolloProvider>
);
