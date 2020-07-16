import React from "react";
import styled from "@emotion/styled";

const Wrapper = styled("div")`
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
`;

const Image = styled("img")`
  object-fit: cover;
  width: auto;
  height: 100%;
  max-height: 250px;

  filter: grayscale(1) contrast(1.3);
`;

export const Photograph = ({ src = `` }) => {
  return (
    <Wrapper>
      <Image src={src} />
    </Wrapper>
  );
};
