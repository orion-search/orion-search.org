import React from "react";

import styled from "@emotion/styled";

export const Wrapper = styled("header")`
  display: flex;
  margin-bottom: ${props => props.theme.spacing.large};
`;

export const Title = styled("h1")`
  ${props => props.theme.type.style.huge}
  display: flex;
  margin: 0;
`;

export default ({ title }) => {
  return (
    <Wrapper>
      <Title>{title}</Title>
    </Wrapper>
  );
};
