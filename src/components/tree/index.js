import React from "react";
import styled from "@emotion/styled";

const defaultItems = [
  {
    id: "A",
    children: [
      {
        id: "A0",
        children: []
      },
      {
        id: "A1",
        children: [
          {
            id: "A10",
            children: []
          },
          {
            id: "A11",
            children: []
          },
          {
            id: "A12",
            children: []
          }
        ]
      },
      {
        id: "A2",
        children: []
      }
    ]
  },
  {
    id: "B",
    children: [
      {
        id: "B0",
        children: []
      },
      {
        id: "B1",
        children: []
      },
      {
        id: "B2",
        children: [
          {
            id: "B20",
            children: []
          },
          {
            id: "B21",
            children: []
          }
        ]
      }
    ]
  }
];

const Leaf = styled("div")`
  position: relative;
  //margin-left: 2em;
  color: green;
`;

const Root = styled("div")`
  //position: relative;
  //padding-left: 1em;
  //font-weight: bold;
  //color: red;
  width: fit-content;
`;

const Boo = styled("div")`
  //position: relative;
  margin-left: 1em;
  font-weight: bold;
  color: red;
`;

const Item = ({ value }) => {
  return value.children.length === 0 ? (
    <Leaf>{`${value.id}`}</Leaf>
  ) : (
    <Root>{`${value.id}`}</Root>
  );
};

// receives an array of arrays with objects as values
const Tree = ({ items = defaultItems }) => {
  return items.map(item => {
    console.log(item);
    // if (!item.children.length) return null;
    return (
      <Root>
        <Item value={item} />
        {item.children.length > 0 && (
          <Boo>
            <Tree items={item.children} />
          </Boo>
        )}
      </Root>
    );
  });
};

export default Tree;
