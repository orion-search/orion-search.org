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
      <div
        css={(theme) =>
          css`
            ${theme.type.style.huge};
          `
        }
      >
        H1 - {placeholderTitleText}
      </div>
      <div
        css={(theme) =>
          css`
            ${theme.type.style.large};
          `
        }
      >
        H2 - {placeholderTitleText}
      </div>
      <div
        css={(theme) =>
          css`
            ${theme.type.style.normal};
          `
        }
      >
        H3 - {placeholderTitleText}
      </div>
      <div
        css={(theme) => css`
          ${theme.type.style.small};
        `}
      >
        H4 - {placeholderTitleText}
      </div>

      <div>{placeholderText}</div>
      <div
        css={(theme) => css`
          ${theme.type.style.small};
        `}
      >
        {placeholderText}
      </div>
    </div>
  );
};
