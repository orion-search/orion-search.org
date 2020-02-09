import React from "react";
// import { Global, css } from "@emotion/core";
import styled from "@emotion/styled";
// import theme from "../styles/";

// const Wrapper = styled("div")`
//   border: 2px solid green;
//   padding: 10px;
// `;

export const PageLayoutWrapper = styled("main")`
  width: 100vw;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 5vmin;
  box-sizing: border-box;

  & > * {
    animation: 2s fadeIn;
  }
`;

export const Row = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  margin: ${props => props.theme.spacing.normal} 0;

  width: 100%;
`;

export const Column = styled("div")`
  align-self: ${props => (props.alignSelf ? props.alignSelf : "auto")};
  display: flex;
  flex-direction: column;

  margin: 0 ${props => props.theme.spacing.normal};

  width: 100%;
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
