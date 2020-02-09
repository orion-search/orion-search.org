import React from "react";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const Wrapper = styled("div")`
  display: flex;
  & > a {
    text-decoration: none;
  }
`;

const Button = styled("button")`
  background: transparent;
  border: ${props => `2px solid ${props.theme.colors.white}`};

  color: ${props => `${props.theme.colors.white}`};
  cursor: pointer;

  display: flex;
  flex-direction: column;
  align-items: center;

  font-size: ${props => props.theme.type.sizes.normal};
  font-weight: bolder;

  padding: ${props => `calc(${props.theme.spacing.normal} / 2)`}
    ${props => props.theme.spacing.huge};

  margin: ${props => props.theme.spacing.small} 0;

  text-transform: uppercase;

  &:hover {
    background: ${props => props.theme.colors.white};
    color: ${props => props.theme.colors.black};
    mix-blend-mode: multiply;
  }

  &:visited {
    color: none;
  }
`;

export const LinkButton = ({ children, to, onMouseDown }) => (
  <Wrapper>
    <Link to={to} onMouseDown={onMouseDown}>
      <Button>{children}</Button>
    </Link>
  </Wrapper>
);