/**
 * @file A loading bar component that kicks off the experience
 */
import React, { useRef } from "react";
import { css } from "@emotion/core";

const LoadingBar = () => {
  const bar = useRef(null);

  return (
    <div
      css={css`
        font-size: 4vmin;
        font-weight: 300;
        height: 100vh;
        width: 100vw;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        & > * {
          animation: 2s fadeIn;
        }
      `}
    >
      <p>Loading...</p>
      <div
        css={css`
          background-color: white;
          height: 5px;
          border-radius: 3px;
          width: 0px;
          animation: 5s loadingBar;
        `}
        ref={bar}
      />
    </div>
  );
};

export default LoadingBar;
