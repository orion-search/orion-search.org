import React from "react";
import Dropdown from ".";

export default {
  title: "Design System/Atoms/Dropdown",
  component: Dropdown,
};

export const Default = () => (
  <Dropdown values={["Option A", "Option B", "OptionC"]} />
);
