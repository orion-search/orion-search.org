import React, { useState } from "react";
import { action } from "@storybook/addon-actions";
import Toggle from ".";

export default {
  title: "Toggle",
  component: Toggle,
};

export const Default = () => {
  const [selected, setSelected] = useState("OptionA");

  return (
    <Toggle
      values={["OptionA", "OptionB", "OptionC"]}
      selected={selected}
      onChange={(value) => {
        action("clicked");
        setSelected(value);
      }}
    />
  );
};
