import React, { useRef } from "react";
import { TextArea, SearchBar } from ".";
import { withKnobs, boolean } from "@storybook/addon-knobs";

export default {
  title: "Design System/Atoms/Text Input",
  component: TextArea,
  decorators: [withKnobs],
};

export const Search_Bar = () => {
  const ref = useRef(``);
  return (
    <SearchBar
      autoResize={boolean("Resize", true)}
      ref={ref}
      placeholder={"Type something..."}
    />
  );
};
