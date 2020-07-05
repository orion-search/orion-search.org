/** @jsx jsx */
import { lazy, Suspense } from "react";
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { Route, Switch, Link, useLocation } from "react-router-dom";
import { animated, useTransition } from "react-spring";
import FAQPage from "./faq";

import { importMDX } from "mdx.macro";

import { urls } from "../../utils";
const Content = lazy(() => importMDX("../../assets/copy/about.md"));

const Wrapper = styled("div")`
  position: absolute;
  max-width: ${(props) => props.theme.breakpoints.width.tablet};

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
          <animated.div style={props}>
            <Switch location={location}>
              <Route
                exact
                path={[urls.about.index]}
                render={() => (
                  <Suspense fallback={<div>Loading...</div>}>
                    <Content />
                    <Link to={urls.about.faq}>to FAQ</Link>
                  </Suspense>
                )}
              />
              <Route
                exact
                path={[urls.about.faq]}
                // render={() => <h1>Gwello</h1>}
                render={() => <FAQPage />}
              />
            </Switch>
          </animated.div>
        </Wrapper>
      ))}
    </div>
  );
};

export default AboutPage;
