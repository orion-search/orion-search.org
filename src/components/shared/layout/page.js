/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

import logo from "../../../assets/img/logo.svg";
import { Row } from "./flex";
import { urls } from "../../../utils";

const sidePadding = `3vw`;

export const PageLayoutWrapper = styled("main")`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: ${(props) =>
    `0 ${sidePadding} ${props.noPaddingBottom ? `0` : `5vh`} ${sidePadding}`};
  box-sizing: border-box;
`;

export const NavBarWrapper = styled("div")`
  width: 100vw;
  height: 60px;
  margin-bottom: ${(props) => props.theme.spacing.medium};
  padding: ${(props) => props.theme.spacing.small} ${sidePadding};
  box-sizing: border-box;
  align-items: center;
  align-self: center;
  font-weight: bold;

  user-select: none;

  backdrop-filter: blur(2px) brightness(20%);

  border-bottom: ${(props) => `1px solid ${props.theme.colors.white}`};

  display: flex;
  position: relative;
`;

export const NavItem = styled(({ highlighted, ...props }) => (
  <Link {...props} />
))`
  text-decoration: ${(props) => (props.highlighted ? `underline` : `none`)};
  color: ${(props) => props.theme.colors.white};
`;

const navURLs = [
  {
    to: urls.diversity,
    name: "Diversity Index",
  },
  {
    to: urls.explore,
    name: "Explore Papers",
  },
  {
    to: urls.search.landing,
    name: "Search",
  },
];

export const PageLayout = ({ children, match, ...props }) => {
  const location = useLocation().pathname;
  return (
    <PageLayoutWrapper {...props}>
      <NavBarWrapper>
        <div
          css={css`
            height: 40px;
            margin-right: 1rem;
          `}
        >
          <Link to={urls.root}>
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
            line-height: 40px;
          `}
        >
          Orion Search Engine v0.0.1
        </div>

        <Row
          css={css`
            margin-left: auto;
          `}
          width={1 / 4}
        >
          {navURLs.map((u) => (
            <NavItem
              key={`nav-item-to-${u.to}`}
              to={u.to}
              highlighted={location === u.to}
            >
              {u.name}
            </NavItem>
          ))}
        </Row>
      </NavBarWrapper>
      {children}
    </PageLayoutWrapper>
  );
};
