import React from "react";
import styled from "@emotion/styled";

import closeIcon from "../../assets/img/cross.svg";

const Wrapper = styled("div")`
  margin: ${props => props.theme.spacing.small} 0;
  padding: 2% 0;
`;

const Item = styled("div")`
  animation: 1s fadeIn;
  align-items: center;
  display: flex;
  font-size: ${props => props.theme.type.sizes.small};
  margin: ${props => props.theme.spacing.tiny} 0;
  opacity: ${props => (props.focused ? 1 : 0.6)};
`;

const CloseIcon = styled("img")`
  cursor: pointer;
  fill: ${props => props.theme.colors.white};
  width: 8px;
  height: 8px;
  margin-right: ${props => props.theme.spacing.small};
`;

const Selections = ({
  values,
  onClick,
  onMouseOver,
  onMouseOut,
  focused = null
}) => {
  return (
    values && (
      <Wrapper>
        {values.map(v => (
          <Item
            key={`selection-value-${v}`}
            focused={focused ? (focused === v ? true : false) : true}
          >
            <CloseIcon onClick={() => onClick(v)} src={closeIcon} />
            <div
              data-value={v}
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
            >
              {v}
            </div>
          </Item>
        ))}
      </Wrapper>
    )
  );
};

export default Selections;
