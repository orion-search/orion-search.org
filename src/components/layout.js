import React from "react";
import { Global, css } from "@emotion/core";
import styled from "@emotion/styled";
// import theme from "../styles/";

const Wrapper = styled("div")`
  border: 2px solid green;
  padding: 10px;
`;

export const PageLayout = ({ children }) => (
  <Wrapper>
    <Global
      styles={css`
        div {
          background: red;
          color: white;
        }
      `}
    />
    {children}
  </Wrapper>
);

export const FullPageLayout = ({ children }) => (
  <main
    css={css`
      width: 100vw;
      height: 100vh;
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: hidden; /* @TODO figure out why this is necessary to prevent scroll (vh units??) */

      & > * {
        animation: 2s fadeIn;
      }
    `}
  >
    {children}
  </main>
);
