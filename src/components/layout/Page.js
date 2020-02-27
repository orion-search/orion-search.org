/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

import logo from "../../assets/img/logo.svg";
import Breadcrumbs from "../breadcrumbs";
import { Column } from "../layout";
import { Row } from "./Flex";

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
  margin-bottom: ${props => props.theme.spacing.medium};
  padding: ${props => props.theme.spacing.small} 5vmin;
  box-sizing: border-box;
  align-items: center;
  align-self: center;

  backdrop-filter: blur(2px) brightness(20%);

  border-bottom: ${props => `1px solid ${props.theme.colors.white}`};

  display: flex;
  position: relative;
`;

export const NavItem = styled(({ highlighted, ...props }) => (
  <Link {...props} />
))`
  text-decoration: ${props => (props.highlighted ? `underline` : `none`)};
  color: ${props => props.theme.colors.white};
`;

const navURLs = [
  {
    to: "/profile/country",
    name: "Country"
  },
  {
    to: "/profile/topic",
    name: "Topic"
  },
  {
    to: "/explore",
    name: "Papers"
  }
];

export const PageLayout = ({ children, match, ...props }) => {
  const location = useLocation().pathname;
  return (
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
          Orion Search Engine v0.0.1
        </div>

        {/* @todo Breadcrumbs is just a dummy value for correct flex alignment  */}
        <Breadcrumbs values={[]} />

        <Row width={1 / 4}>
          {navURLs.map(u => (
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
