import React from "react";

const Dropdown = ({
  options,
  selected,
  onChange = e => console.log(e.target.value)
}) => {
  return (
    <select onChange={onChange}>
      {options.map(o => (
        <option key={`dropdown-option-${o}`} default={o === selected}>
          {o}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
