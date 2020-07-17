import React from "react";
import styled from "@emotion/styled";

const Wrapper = styled("div")`
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  filter: grayscale(1) contrast(1.3);
  border-radius: 4px;
`;

const Image = styled("img")`
  object-fit: cover;
  background-size: cover;
  max-width: 100%;
  height: auto;
  ${(props) =>
    props.square
      ? `
  width: 200px;
  height: 200px;
  `
      : `max-width: 100%;
  height: auto;`}
`;

export const Photograph = ({ src = ``, square = false }) => {
  return (
    <Wrapper>
      <Image square src={src} />
    </Wrapper>
  );
};
