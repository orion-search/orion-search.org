import React, { useState } from "react";
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
            children: [
              {
                id: "B200",
                children: []
              },
              {
                id: "B201",
                children: []
              }
            ]
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
  //color: purple;
  width: fit-content;
`;

const Boo = styled("div")`
  //position: relative;
  margin-left: 1em;
  font-weight: bold;
  color: red;
  cursor: pointer;
`;

const Item = ({ value, onClick }) => {
  return value.children.length === 0 ? (
    <Leaf>{`${value.id}`}</Leaf>
  ) : (
    <Root onClick={onClick}>{`${value.id}`}</Root>
  );
};

// receives an array of arrays with objects as values
const Tree = ({ items = defaultItems }) => {
  const ui = new Map();
  items.forEach(c => ui.set(c.id, false));
  const [visible, setVisible] = useState(ui);
  return items.map(item => {
    return (
      <Root key={`item-${item.id}`}>
        {
          <Item
            value={item}
            onClick={e => {
              console.log(item.id);
              e.stopPropagation();
              setVisible(new Map(visible.set(item.id, !visible.get(item.id))));
            }}
          />
        }
        {visible.get(item.id) && (
          <Boo>
            <Tree items={item.children} />
          </Boo>
        )}
      </Root>
    );
  });
};

export default Tree;
