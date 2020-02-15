import React from "react";
import styled from "@emotion/styled";

const Wrapper = styled("div")`
  max-height: 10vh;
  overflow-y: auto;
  padding: 2% 0;
  mask-image: ${props => `
    linear-gradient(
    to bottom,
    ${props.theme.colors.black}00,
    ${props.theme.colors.black}FF 8%,
    ${props.theme.colors.black}FF 92%,
    ${props.theme.colors.black}00 100%
  )
  `};

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
  font-size: ${props => props.theme.type.sizes.small};
  margin-bottom: ${props => props.theme.spacing.tiny};

  padding: ${props => props.theme.spacing.small};
  padding-left: 0;

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
