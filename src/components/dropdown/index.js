import React from "react";

const Dropdown = ({
  values,
  selected,
  onChange = e => console.log(e.target.value)
}) => {
  return (
    <div>
      <select onChange={onChange} defaultValue={selected}>
        {values.map(o => (
          <option key={`dropdown-option-${o ? o : Math.random()}`} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
