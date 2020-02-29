import React from "react";
import styled from "@emotion/styled";

const Wrapper = styled("div")`
  display: flex;
  text-transform: uppercase;
  width: 100%;
  font-size: ${props => props.theme.type.sizes.small};
`;

export default ({ values, ...props }) => {
  return <Wrapper css={props.css}>{values.join(" _ ")}</Wrapper>;
};
