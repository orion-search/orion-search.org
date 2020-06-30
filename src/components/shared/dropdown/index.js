import React from "react";
import styled from "@emotion/styled";
import ReactSelect from "react-select";
import theme from "../../../styles";

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

// export const MultiItemSelect = styled(ReactSelect)`
//   background-color: transparent;
//   color: ${(props) => props.theme.colors.black};
// `;
const customStyles = {
  control: (provided) => ({
    ...provided,
    outline: `0px`,
    background: theme.colors.black,
    borderRadius: `0`,
    border: `none`,
    borderColor: theme.colors.orange,
    borderBottom: `2px solid ${theme.colors.orange}`,
    boxShadow: `none`,
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: `transparent`,
  }),
  option: (provided, state) => ({
    ...provided,
    background: state.isFocused ? theme.gradients.red : theme.colors.black,
    color: state.isFocused ? theme.colors.black : theme.colors.white,
  }),
  multiValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = "opacity 300ms";

    return {
      ...provided,
      opacity,
      transition,
      color: theme.colors.white,
      backgroundColor: theme.colors.transparent,
      border: `1px solid ${theme.colors.orange}`,
    };
  },
  multiValueLabel: (provided) => ({
    ...provided,
    color: theme.colors.white,
  }),
  multiValueRemove: (provided, state) => ({
    ...provided,
    color: theme.colors.white,
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: `initial 0px`,
  }),
};

export const MultiItemSelect = (props) => (
  <ReactSelect styles={customStyles} {...props} />
);

export default Dropdown;
