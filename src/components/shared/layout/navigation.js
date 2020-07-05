/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";

import { useLocation } from "react-router";
import { Link } from "react-router-dom";

import logo from "../../../assets/img/logo.svg";
// import { Row } from "./flex";
import { urls } from "../../../utils";

const NavBarWrapper = styled("div")`
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 60px;
  margin-bottom: ${(props) => props.theme.spacing.medium};
  padding: ${(props) =>
    `${props.theme.spacing.small} ${props.theme.layout.page.side}`};
  box-sizing: border-box;
  align-items: center;
  align-self: center;

  user-select: none;

  backdrop-filter: blur(2px) brightness(20%);

  border-bottom: ${(props) => `1px solid ${props.theme.colors.white}`};

  display: flex;
  position: relative;
`;

const NavItem = styled(({ highlighted, ...props }) => <Link {...props} />)`
  // text-decoration: ${(props) => (props.highlighted ? `underline` : `none`)};
  color: ${(props) =>
    props.highlighted ? props.theme.colors.orange : props.theme.colors.white};
    font-weight: ${(props) => (props.highlighted ? `normal` : `normal`)};
  margin-right: ${(props) => props.theme.spacing.large};
`;

const navURLs = [
  {
    to: [urls.diversity],
    name: "Metrics",
  },
  {
    to: [urls.explore],
    name: "Explore Papers",
  },
  {
    to: [urls.root, urls.search.landing, urls.search.results],
    name: "Search",
  },
  {
    to: [urls.about.index, urls.about.faq],
    name: "About Orion",
  },
];

export const NavigationBar = () => {
  const location = useLocation().pathname;

  return (
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
        css={(theme) => css`
          margin-right: 1rem;
          line-height: 40px;

          // font-weight: bold;
          text-transform: uppercase;

          line-height: ${theme.type.sizes.normal};
          margin-right: ${theme.spacing.huge};
        `}
      >
        <span
          css={(theme) =>
            css`
              font-weight: bold;
              color: ${theme.colors.orange};
            `
          }
        >
          Orion Search
        </span>{" "}
        /
      </div>

      {/* <Row
        css={css`
          margin-left: auto;
          max-width: 800px;
        `}
        width={1 / 2}
      > */}
      {navURLs.map((u) => (
        <NavItem
          key={`nav-item-to-${u.to}`}
          to={u.to[0]}
          highlighted={u.to.indexOf(location) > -1}
        >
          {u.name}
        </NavItem>
      ))}
      {/* </Row> */}
    </NavBarWrapper>
  );
};
