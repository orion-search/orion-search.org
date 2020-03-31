import React from "react";
import styled from "@emotion/styled";

const PaperElm = styled("div")`
  display: flex;
  margin-bottom: ${props => `${props.theme.spacing.large}`};
  padding: ${props => `${props.theme.spacing.large}`} 0;
  font-size: ${props => `${props.theme.type.sizes.huge}`};

  animation: 1s fadeIn;
`;

const Paper = ({ data }) => {
  return <PaperElm>{data.title}</PaperElm>;
};

export default Paper;
