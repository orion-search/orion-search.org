/** @jsx jsx */
import { css } from "@emotion/core";

export const blurEdges = props => css`
  mask-image: linear-gradient(
    to bottom,
    ${props.theme.colors.black}00,
    ${props.theme.colors.black}FF 8%,
    ${props.theme.colors.black}FF 92%,
    ${props.theme.colors.black}00 100%
  );

  &::-webkit-scrollbar {
    width: 5px;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: white;
    border-radius: 10px;
  }
`;

export const yOverflow = props => css`
  overflow-y: auto;
  overflow-x: hidden;
`;
