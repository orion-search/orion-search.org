import React from "react";
import { render } from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import { createBrowserHistory } from "history";
import { Router } from "react-router";

import { client } from "./utils/apollo";
import { ThemeProvider } from "emotion-theming";
import { Global } from "@emotion/core";

import theme from "./styles";
import App from "./App";

export const history = createBrowserHistory();

(async () => {
  render(
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Global
          styles={{
            body: {
              fontFamily: "Matter"
            }
          }}
        />
        <Router history={history}>
          <App />
        </Router>
      </ThemeProvider>
    </ApolloProvider>,
    document.getElementById("root")
  );
})();
