/** @jsx jsx */
import { forwardRef } from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { useEffect, useRef } from "react";

import { clamp } from "../../utils";

const Wrapper = styled("div")`
  // display: block;
  position: absolute;
  // position: relative;
  height: 800px;
  width: 200px;
  left: 0px;
  background-color: red;

  overflow-y: scroll;
`;

const Categories = forwardRef(({ categoryScale, deltaY }, ref) => {
  const scrollY = useRef(0);
  useEffect(() => {
    // clamp(scrollY, 0, ref.current.scrollHeight);
    scrollY.current = clamp(
      scrollY.current + deltaY,
      0,
      ref.current.scrollHeight
    );
    console.log(ref, scrollY.current, ref.current.scrollHeight);
    ref.current.scrollTop = scrollY.current;
  }, [deltaY, ref]);
  return (
    <Wrapper ref={ref}>
      {categoryScale.domain().map(category => (
        <div
          key={`category-label-${category}`}
          css={css`
            // position: absolute;
            // top: ${categoryScale(category)}px;
            margin-bottom: 112px;
          `}
        >
          {category}
        </div>
      ))}
    </Wrapper>
  );
});

export default Categories;
