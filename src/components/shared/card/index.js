/** @jsx jsx  */

// import React from "react";
import styled from "@emotion/styled";
import { jsx } from "@emotion/core";

const Wrapper = styled("div")`
  display: flex;
  flex-direction: column;

  width: 100%;
  max-width: 300px;
  align-items: center;
  justify-content: center;

  margin: ${(props) => props.theme.spacing.large};

  text-align: center;
`;

const Icon = styled("div")`
  width: 50%;
  height: 100px;
  background-position-y: center;
  background-position-x: center;
  background-image: ${(props) => `url(${props.img})` || "none"};
  background-repeat: no-repeat;
`;

const Title = styled("div")`
  font-weight: bold;
  font-size: ${(props) => props.theme.type.sizes.large};

  margin: ${(props) => props.theme.spacing.normal} 0
    ${(props) => props.theme.spacing.small} 0;
`;

export const Card = ({ text, title, image, ...props }) => {
  return (
    <Wrapper {...props}>
      {image && <Icon img={image} />}
      <Title>{title}</Title>
      <div>{text}</div>
    </Wrapper>
  );
};

// @todo
export const PhotoCard = () => null;
