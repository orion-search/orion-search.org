/** @jsx jsx */
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { lazy, Suspense } from "react";
import { importMDX } from "mdx.macro";

const Content = lazy(() => importMDX("../../assets/copy/about.mdx"));

const Wrapper = styled("div")`
  a {
    color: ${(props) => props.theme.colors.white};
    font-weight: bolder;
    text-decoration: underline;
  }
`;

const AboutPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Wrapper>
          <Content />
        </Wrapper>
      </Suspense>
    </div>
  );
};

export default AboutPage;
