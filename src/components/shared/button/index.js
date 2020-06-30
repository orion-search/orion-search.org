import React from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const Wrapper = styled("div")`
  display: flex;
  & > a {
    text-decoration: none;
  }

  pointer-events: ${(props) => (props.inactive ? `none` : `all`)};
`;

export const Button = styled("button")`
  background: ${(props) =>
    props.nofill ? `transparent` : `${props.theme.gradients.red}`};
  border: ${(props) => (props.nofill ? `2px solid` : `none`)};
  border-radius: 4px;
  box-sizing: border-box;
  border-color: ${(props) =>
    props.nofill ? `${props.theme.colors.orange}` : `initial`};

  color: ${(props) =>
    props.nofill
      ? `${props.theme.colors.white}`
      : `${props.theme.colors.white}`};
  cursor: pointer;

  display: flex;
  flex-direction: column;
  align-items: center;

  font-size: ${(props) => props.theme.type.sizes.normal};
  font-weight: bolder;

  padding: ${(props) => `calc(${props.theme.spacing.normal} / 2)`}
    ${(props) => props.theme.spacing.huge};

  margin: ${(props) => props.theme.spacing.small} 0;

  text-transform: uppercase;

  outline: none;
  user-select: none;

  &:hover {
    background: ${(props) =>
      props.nofill ? props.theme.gradients.red : props.theme.colors.white};
    color: ${(props) =>
      props.nofill ? props.theme.colors.white : props.theme.colors.black};
    mix-blend-mode: multiply;
  }

  &:visited {
    color: none;
  }
`;

export const SmallButton = styled(Button)`
  padding: ${(props) => `calc(${props.theme.spacing.tiny})`}
    ${(props) => props.theme.spacing.small};
  font-size: ${(props) => props.theme.type.sizes.tiny};
  border-right: none;
  border-top: none;
  border-bottom: none;
  border-radius: ${(props) => (props.nofill ? `0px` : `4px`)};
  border-color: ${(props) => props.theme.colors.red};
  pointer-events: initial;
`;

export const MediumButton = styled(Button)`
  padding: ${(props) => `calc(${props.theme.spacing.small})`}
    ${(props) => props.theme.spacing.small};
  font-size: ${(props) => props.theme.type.sizes.small};
  // border-right: none;
  // border-left: none;
  pointer-events: initial;
`;

export const LinkButton = ({ children, to, onMouseDown, inactive }) => (
  <Wrapper inactive={inactive}>
    <Link to={to} onMouseDown={onMouseDown}>
      <Button>{children}</Button>
    </Link>
  </Wrapper>
);
