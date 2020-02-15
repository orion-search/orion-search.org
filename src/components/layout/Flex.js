/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";

export const Row = styled("div")`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  margin: ${props => props.theme.spacing.normal} 0;

  width: ${props => (props.width ? `${props.width * 100}%` : `100%`)};
`;

export const Column = styled("div")`
  align-self: ${props => (props.alignSelf ? props.alignSelf : "auto")};
  display: flex;
  flex-direction: column;

  margin: 0 ${props => props.theme.spacing.normal};

  width: ${props => (props.width ? `${props.width * 100}%` : `100%`)};
`;
