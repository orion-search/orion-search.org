/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

import logo from "../../../assets/img/logo.svg";
import Breadcrumbs from "../breadcrumbs";
import { Row, Flex } from "./flex";
import { urls } from "../../../utils";

export const PageLayoutWrapper = styled("main")`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0 5vmin 5vmin 5vmin;
  box-sizing: border-box;
`;

export const NavBarWrapper = styled(Flex)`
  width: 100vw;
  height: fit-content;
  margin-bottom: ${props => props.theme.spacing.medium};
  padding: ${props => props.theme.spacing.small} 5vmin;
  box-sizing: border-box;

  align-items: center;
  align-self: center;
  justify-content: space-between;

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
    to: urls.networks,
    name: "Collaboration Networks"
  },
  {
    to: urls.diversity,
    name: "Diversity Index"
  },
  {
    to: urls.profileCountry,
    name: "Country"
  },
  {
    to: urls.profileTopic,
    name: "Topic"
  },
  {
    to: urls.explore,
    name: "Papers"
  }
];

export const PageLayout = ({ children, match, ...props }) => {
  const location = useLocation().pathname;
  return (
    <PageLayoutWrapper {...props}>
      <NavBarWrapper>
        <div
          css={css`
            height: 40px;
            display: flex;
          `}
        >
          <Link
            css={css`
              width: fit-content;
            `}
            to={urls.root}
          >
            <img
              css={css`
                height: 100%;
              `}
              src={logo}
              alt="orion-search-logo"
            />
          </Link>
          <div
            css={css`
              align-self: center;
              margin-left: 10px;
            `}
          >
            Orion Search Engine v0.0.1
          </div>
        </div>

        <Row width={1 / 2}>
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
