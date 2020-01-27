import React from "react";
import { Global, css } from "@emotion/core";
import styled from "@emotion/styled";
// import theme from "../styles/";

const Wrapper = styled("div")`
  border: 2px solid green;
  padding: 10px;
`;

export const PageLayoutWrapper = styled("main")`
  width: 100vw;
  position: relative;
  display: flex;
  flex-direction: row;
  padding: 5vmin;
  box-sizing: border-box;

  & > * {
    animation: 2s fadeIn;
  }
`;

// export const PageLayout = ({ children }) => (
//   <Wrapper>
//     <Global
//       styles={css`
//         div {
//           background: red;
//           color: white;
//         }
//       `}
//     />
//     {children}
//   </Wrapper>
// );

export const PageLayout = ({ children }) => (
  <PageLayoutWrapper>{children}</PageLayoutWrapper>
);
