import React from "react";
import styled from "@emotion/styled";

const ListItem = styled("li")`
  ${props => props.theme.type.style.small}

  display: flex;

  &:hover {
    text-decoration: underline;
  }

  cursor: pointer;

  margin-bottom: ${props => props.theme.spacing.small};
`;

const Title = styled("div")`
  ${props => props.theme.type.style.large}
  display: flex;
  width: 100%;
  text-transform: capitalize;
`;

const Wrapper = styled("div")``;

export const List = styled("ul")`
  display: flex;
  flex-direction: column;

  margin-bottom: ${props => props.theme.spacing.normal};
  padding: 0;
`;

export default ({ title, values }) => {
  return (
    <Wrapper>
      {title && <Title>{title}</Title>}
      <List>
        {values.map(v => (
          <ListItem key={`list-item-${v}`}>{v}</ListItem>
        ))}
      </List>
    </Wrapper>
  );
};
