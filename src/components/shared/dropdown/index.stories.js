import React from "react";
import Dropdown, { MultiItemSelect } from ".";

export default {
  title: "Design System/Atoms/Dropdown",
  component: Dropdown,
};

export const Default = () => (
  <Dropdown values={["Option A", "Option B", "OptionC"]} />
);

const defaultOptions = ["Option A", "Option B", "Option C"];

export const MultiItem = () => (
  <MultiItemSelect
    closeMenuOnSelect={false}
    isMulti
    options={defaultOptions.map((d) => ({ value: d, label: d }))}
  />
);
