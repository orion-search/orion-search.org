/** @jsx jsx */
/** @jsxFrag React.Fragment */
import React from "react"; // eslint-disable-line no-unused-vars
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
// import { Link } from "react-router-dom";

import { NavigationBar } from "./navigation";

const PageLayoutWrapper = styled("main")`
  width: 100%;
  padding: ${(props) => `0 ${props.theme.layout.page.side}`};
  box-sizing: border-box;
`;

export const PageLayout = ({ noNav = false, children, match, ...props }) => {
  // const location = useLocation().pathname;
  return (
    <>
      {!noNav && <NavigationBar />}
      <PageLayoutWrapper {...props}>{children}</PageLayoutWrapper>
    </>
  );
};
