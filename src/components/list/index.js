import React from "react";
import styled from "@emotion/styled";

const ListItem = styled("a")`
  ${props => props.theme.type.style.small}

  display: flex;

  flex-grow: 1;
  align-items: left;

  margin-bottom: ${props => props.theme.spacing.small};
`;

const Title = styled("div")`
  ${props => props.theme.type.style.large}
  display: flex;
  width: 100%;
  text-transform: capitalize;
`;

const Wrapper = styled("div")`
  display: flex;
  flex-direction: column;
`;

export const List = styled("ul")`
  display: flex;
  flex-direction: column;

  margin-bottom: ${props => props.theme.spacing.normal};
  padding: 0;
  list-style-type: none;
`;

export default ({ title, values }) => {
  return (
    <Wrapper>
      <Title>{title}</Title>
      <List>
        {values.map(v => (
          <ListItem key={`list-item-${v}`}>{v}</ListItem>
        ))}
      </List>
    </Wrapper>
  );
};
