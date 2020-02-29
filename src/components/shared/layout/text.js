/** @jsx jsx */
import { css } from "@emotion/core";

import styled from "@emotion/styled";

export const textTransform = props => css`
  text-transform: ${props.uppercase ? `uppercase` : `capitalize`};
`;

export const Title = styled("h1")`
  font-size: ${props => props.theme.type.sizes.huge};
  ${textTransform};
`;

export const Header = styled("h2")`
  font-size: ${props => props.theme.type.sizes.large};
  ${textTransform};
`;

export const Subheader = styled("h4")`
  font-size: ${props => props.theme.type.sizes.medium};
  margin-bottom: ${props => props.theme.spacing.small};
  ${textTransform};
`;
