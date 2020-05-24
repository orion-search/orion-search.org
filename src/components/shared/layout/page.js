/** @jsx jsx */
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
// import { Link } from "react-router-dom";

import NavigationBar from "./navigation";

const PageLayoutWrapper = styled("main")`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: ${(props) => `0 ${props.theme.layout.page.side}`};
  box-sizing: border-box;
`;

export const PageLayout = ({ children, match, ...props }) => {
  // const location = useLocation().pathname;
  return (
    <PageLayoutWrapper {...props}>
      <NavigationBar />
      {children}
    </PageLayoutWrapper>
  );
};
