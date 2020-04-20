/** @jsx jsx */
// import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";

export const Flex = styled("div")`
  display: flex;
  justify-content: ${(props) => props.justifyContent || null};
`;

export const Row = styled("div")`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: ${(props) =>
    props.noSpaceBetween ? `initial` : `space-between`};

  margin: ${(props) => props.theme.spacing[props.mv || "small"]} 0;

  width: ${(props) => (props.width ? `${props.width * 100}%` : `100%`)};
`;

export const Column = styled("div")`
  align-self: ${(props) => (props.alignSelf ? props.alignSelf : "auto")};
  display: flex;
  flex-direction: column;

  width: ${(props) => (props.width ? `${props.width * 100}%` : `100%`)};
`;
