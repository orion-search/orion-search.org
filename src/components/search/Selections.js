import React from "react";
import styled from "@emotion/styled";

import closeIcon from "../../assets/img/cross.svg";

const Wrapper = styled("div")`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: ${props => props.theme.spacing.large} 0;
`;

const Item = styled("div")`
  animation: 1s fadeIn;
  align-items: center;
  display: flex;
  font-size: ${props => props.theme.type.sizes.small};
  margin: ${props => props.theme.spacing.tiny} 0;
`;

const CloseIcon = styled("img")`
  cursor: pointer;
  fill: ${props => props.theme.colors.white};
  width: 10px;
  height: 10px;
  margin-right: ${props => props.theme.spacing.small};
`;

const Selections = ({ values, onClick }) => {
  return (
    values && (
      <Wrapper>
        {values.map(v => (
          <Item key={`selection-value-${v}`}>
            <CloseIcon onClick={() => onClick(v)} src={closeIcon} />
            <div>{v}</div>
          </Item>
        ))}
      </Wrapper>
    )
  );
};

export default Selections;
