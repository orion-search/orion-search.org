/** @jsx jsx */
// import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";

export const Flex = styled("div")`
  display: flex;
  justify-content: ${props => props.justifyContent || null};
  flex-wrap: wrap;
`;

export const Row = styled("div")`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;

  margin: ${props => props.theme.spacing.small} 0;

  @media screen and (max-width: 768px) {
    & {
      width: 100%;
    }
  }

  @media screen and (min-width: 768px) {
    & {
      width: ${props =>
        props.width
          ? typeof props.width === "number"
            ? `${props.width * 100}%`
            : props.width
          : `100%`};
    }
  }
`;

export const Column = styled("div")`
  align-self: ${props => (props.alignSelf ? props.alignSelf : "auto")};
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 768px) {
    & {
      width: 100%;
    }
  }

  @media screen and (min-width: 768px) {
    & {
      width: ${props =>
        props.width
          ? typeof props.width === "number"
            ? `${props.width * 100}%`
            : props.width
          : `100%`};
    }
  }
`;
