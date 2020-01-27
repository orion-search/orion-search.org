import React from "react";

const Dropdown = ({
  values,
  selected,
  onChange = e => console.log(e.target.value)
}) => {
  return (
    <div>
      <select onChange={onChange}>
        {values.map(o => (
          <option key={`dropdown-option-${o}`} default={o === selected}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
