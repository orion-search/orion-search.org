/** @jsx jsx */
import styled from "@emotion/styled";
import { useSpring, animated } from "react-spring";

import { fadeInUp } from "../../../utils";

/**
 * @file A loading bar component
 */
import { css, jsx } from "@emotion/core";

const Wrapper = styled(animated.div)`
  font-size: ${(props) => `${props.theme.type.sizes.huge}`};
  display: flex;
  height: 100vh;
  width: 100vw;

  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LoadingBar = () => {
  // const bar = useRef(null);
  const wrapperAnimation = useSpring(fadeInUp);

  return (
    <Wrapper
      css={css`
        font-size: ${(props) => `${props.theme.type.sizes.huge}`};
      `}
      style={wrapperAnimation}
    >
      <div>Downloading latent space /</div>
      <div>Downloading diversity index</div>
    </Wrapper>
  );
};

export default LoadingBar;
