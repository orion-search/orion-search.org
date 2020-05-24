import React from "react";
import styled from "@emotion/styled";

const Wrapper = styled("div")`
  display: flex;
`;

const Select = styled("select")`
  appearance: none;
  background: transparent;
  text-decoration: underline;
  cursor: pointer;
  color: ${(props) => props.theme.colors.white};
  border: none;

  font-weight: bolder;
  display: inline-block;

  font-size: inherit;
  text-transform: inherit;

  padding: ${(props) => props.theme.spacing.small}
    ${(props) => props.theme.spacing.normal};

  &::-ms-expand {
    display: none;
  }

  &:focus {
  }

  & > option {
    font-weight: normal;
    max-width: 40px;
    font-size: 10px;
  }
`;

const Dropdown = ({ values, selected, onChange = (e) => {} }) => {
  return (
    <Wrapper>
      <Select onChange={onChange} defaultValue={selected}>
        {values.map((o) => (
          <option key={`dropdown-option-${o ? o : Math.random()}`} value={o}>
            {o}
          </option>
        ))}
      </Select>
    </Wrapper>
  );
};

export default Dropdown;
