/** @jsx jsx */
import { lazy, Suspense } from "react";
import { jsx, css } from "@emotion/core";
import styled from "@emotion/styled";
import { Route, Switch, useLocation } from "react-router-dom";
import { animated, useTransition } from "react-spring";

import { LinkButton } from "../../components/shared/button";
import { Column } from "../../components/shared/layout";
import FAQPage from "./faq";
import { urls } from "../../utils";
// const Content = lazy(() => importMDX("../../assets/copy/about.md"));
const Content = lazy(() =>
  import("!babel-loader!mdx-loader!../../assets/copy/about.mdx")
);

const Wrapper = styled("div")`
  position: absolute;
  width: calc(
    100vw - ${(props) => props.theme.layout.page.side} -
      ${(props) => props.theme.layout.page.side}
  );

  a {
    color: ${(props) => props.theme.colors.white};
    font-weight: bolder;
    text-decoration: underline;
  }
`;

const AboutPage = () => {
  const location = useLocation();

  const transitions = useTransition(location, (location) => location.pathname, {
    // trail: 1000,
    // unique: true,
    from: {
      opacity: 0,
      transform: "translate3d(10%,0,0)",
    },
    enter: {
      opacity: 1,
      transform: "translate3d(0%,0,0)",
    },
    leave: {
      opacity: 0,
      transform: "translate3d(-10%,0,0)",
    },
  });
  return (
    <div style={{ overflow: "hidden" }}>
      {transitions.map(({ item: location, props, key }) => (
        <Wrapper key={key}>
          <animated.div
            css={css`
              overflow-y: overlay;
            `}
            style={props}
          >
            <Column
              css={(theme) => css`
                max-width: ${theme.breakpoints.width.tablet};
                margin: ${theme.spacing.normal} 0;
              `}
            >
              <Switch location={location}>
                <Route
                  exact
                  path={[urls.about.index]}
                  render={() => (
                    <Suspense fallback={<div>Loading...</div>}>
                      <Content />
                      {/* <Link to={urls.about.faq}>to FAQ</Link> */}
                      <LinkButton to={urls.about.faq} nofill>
                        Frequently Asked Questions
                      </LinkButton>
                    </Suspense>
                  )}
                />
                <Route
                  exact
                  path={[urls.about.faq]}
                  render={() => <FAQPage />}
                />
              </Switch>
            </Column>
          </animated.div>
        </Wrapper>
      ))}
    </div>
  );
};

export default AboutPage;
