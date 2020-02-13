/** @jsx jsx */
// import React from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

import logo from "../../assets/img/logo.svg";
import Breadcrumbs from "../breadcrumbs";

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
  padding: 0 5vmin 5vmin 5vmin;
  box-sizing: border-box;

  & > * {
    animation: 2s fadeIn;
  }
`;

export const NavBarWrapper = styled("div")`
  width: 100vw;
  height: 60px;
  margin-bottom: 5vmin;
  padding: 10px 5vmin;
  box-sizing: border-box;
  align-items: center;
  align-self: center;

  backdrop-filter: blur(2px) brightness(20%);

  border-bottom: ${props => `1px solid ${props.theme.colors.white}`};

  display: flex;
  position: relative;

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
  <PageLayoutWrapper>
    <NavBarWrapper>
      <div
        css={css`
          height: 40px;
          margin-right: 1rem;
        `}
      >
        <Link to={"/"}>
          <img
            css={css`
              height: 100%;
            `}
            src={logo}
            alt="orion-search-logo"
          />
        </Link>
      </div>
      <div
        css={css`
          margin-right: 1rem;
        `}
      >
        Orion Search v0.0.1
      </div>
      <Breadcrumbs values={useLocation().pathname.split("/")} />
    </NavBarWrapper>
    {children}
  </PageLayoutWrapper>
);
