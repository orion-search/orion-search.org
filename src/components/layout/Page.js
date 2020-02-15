/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

import logo from "../../assets/img/logo.svg";
import Breadcrumbs from "../breadcrumbs";

export const PageLayoutWrapper = styled("main")`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0 5vmin 5vmin 5vmin;
  box-sizing: border-box;
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
