import React from "react";
import styled from "@emotion/styled";

const Wrapper = styled("div")`
  max-height: 10vh;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 5px;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 10px white;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: white;
    outline: 1px solid white;
  }
`;

const Item = styled("div")`
  // animation: 1s fadeIn;
  font-size: ${props => props.theme.type.sizes.small};
  margin-bottom: ${props => props.theme.spacing.tiny};

  opacity: ${props => (props.selected ? 1 : 0.6)};
`;

const Suggestions = ({ values, onClick = () => {}, selected }) => {
  return (
    values && (
      <Wrapper>
        {values.map(v => (
          <Item
            key={`suggestion-value-${v}`}
            selected={selected.indexOf(v) > -1}
          >
            <div onClick={() => onClick(v)}>{v}</div>
          </Item>
        ))}
      </Wrapper>
    )
  );
};

export default Suggestions;
