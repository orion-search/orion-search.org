/** @jsx jsx */
import { jsx, css } from "@emotion/core";

export const blurEdges = props => css`
  max-height: 10vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 2% 0;

  margin: ${props.theme.spacing.small} 0;
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
