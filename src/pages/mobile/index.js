/** @jsx jsx */
import { lazy, Suspense } from "react";
import { jsx, css } from "@emotion/core";
import styled from "@emotion/styled";

import { PageLayout, Row, Flex } from "../../components/shared/layout";
import exploreGif from "../../assets/img/explore.gif";
import metricsGif from "../../assets/img/metrics.gif";
import searchGif from "../../assets/img/search.gif";
import logo from "../../assets/img/logo.svg";

const GIF = styled("div")`
  margin: ${(props) => props.theme.spacing.huge} 0;
  & img {
    max-width: 100%;
    height: auto;
  }
`;

const Wrapper = styled("div")`
  a {
    color: ${(props) => props.theme.colors.white};
    font-weight: bolder;
    text-decoration: underline;
  }

  p {
    line-height: ${(props) => props.theme.spacing.large};
  }
`;

const Content = lazy(() =>
  import("!babel-loader!mdx-loader!../../assets/copy/about.mdx")
);

const MobilePageLayout = styled(PageLayout)`
  padding: 0 5vw;
`;

const MobileLayout = () => {
  return (
    <MobilePageLayout noNav>
      <Wrapper>
        <Row
          css={css`
            justify-content: flex-start;
            align-items: center;
          `}
        >
          <Flex>
            <img
              css={(theme) => css`
                width: 50px;
                height: auto;

                margin-right: ${theme.spacing.normal};
              `}
              src={logo}
              alt={`Orion Search Logo`}
            />
          </Flex>
          <Flex>
            <h1>Orion Search</h1>
          </Flex>
        </Row>
        <div
          css={(theme) =>
            css`
              font-size: ${theme.type.sizes.large};
              font-weight: bolder;
            `
          }
        >
          Orion is not currently optimized for mobile usage.
        </div>
        <Row>
          <GIF>
            <img src={exploreGif} alt={`Orion Search Explore Page`} />
          </GIF>
        </Row>
        <Suspense fallback={<div>Loading...</div>}>
          <Content />
        </Suspense>
        <Row>
          <GIF>
            <img src={searchGif} alt={`Orion Search Search Page`} />
          </GIF>
        </Row>
        <Row>
          <GIF>
            <img src={metricsGif} alt={`Orion Search Metrics Page`} />
          </GIF>
        </Row>
      </Wrapper>
    </MobilePageLayout>
  );
};

export default MobileLayout;
