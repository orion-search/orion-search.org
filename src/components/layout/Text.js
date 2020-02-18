// import React from "react";
import styled from "@emotion/styled";

export const Title = styled("h1")`
  font-size: ${props => props.theme.type.sizes.huge};
`;

export const Header = styled("h2")`
  font-size: ${props => props.theme.type.sizes.large};
`;

export const Subheader = styled("h4")`
  font-size: ${props => props.theme.type.sizes.medium};
  margin-bottom: ${props => props.theme.spacing.small};
`;
