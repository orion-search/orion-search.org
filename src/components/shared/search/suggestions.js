import React from "react";
import styled from "@emotion/styled";

import { blurEdges, yOverflow } from "../layout";

const Wrapper = styled("div")`
  margin: ${props => props.theme.spacing.small} 0;

  max-height: 10vh;
  padding: 2% 0;

  ${yOverflow}
  ${blurEdges};
`;

const Item = styled("div")`
  font-size: ${props => props.theme.type.sizes.small};
  margin-bottom: ${props => props.theme.spacing.tiny};

  padding: ${props => props.theme.spacing.small};
  margin-right: ${props => props.theme.spacing.small};
  padding-left: 0;

  cursor: pointer;

  opacity: ${props => (props.selected ? 1 : 0.4)};
  border-bottom: ${props => `1px solid ${props.theme.colors.white}`};
`;

const Suggestions = ({ values, onClick = () => {}, selected }) => {
  return (
    values && (
      <Wrapper>
        {values.map(v => (
          <Item
            key={`suggestion-value-${v}`}
            selected={selected.indexOf(v) > -1}
            onClick={() => onClick(v)}
          >
            {v}
          </Item>
        ))}
      </Wrapper>
    )
  );
};

export default Suggestions;
