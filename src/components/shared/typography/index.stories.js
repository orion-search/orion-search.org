import React from "react";
import { css } from "@emotion/core";

import { placeholderText, placeholderTitleText } from ".";

export default {
  title: "Design System/Atoms/Typography",
};

export const Typography = () => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        & div {
          margin-bottom: 1rem;
        }
      `}
    >
      <h1>H1 - {placeholderTitleText}</h1>
      <h2>H2 - {placeholderTitleText}</h2>
      <h3>H3 - {placeholderTitleText}</h3>
      <h4>H4 - {placeholderTitleText}</h4>

      <div>Normal text — {placeholderText}</div>
      <div
        css={(theme) => css`
          ${theme.type.style.small};
        `}
      >
        Small text — {placeholderText}
      </div>
    </div>
  );
};
