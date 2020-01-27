import React from "react";
import styled from "@emotion/styled";

const Wrapper = styled("div")`
  display: flex;

  width: 100%;
  font-size: ${props => props.theme.type.sizes.small};
`;

export default ({ values }) => {
  return <Wrapper>{values.join(" > ")}</Wrapper>;
};
