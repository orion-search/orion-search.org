import React from "react";
import { Card } from ".";
import { withKnobs } from "@storybook/addon-knobs";

import icon from "../../../assets/img/landing-progress.svg";

export default {
  title: "Design System/Molecules/Card",
  component: Card,
  decorators: [withKnobs],
};

export const Text_Card = () => {
  return (
    <Card
      image={icon}
      title={"Measure progress in science"}
      text={
        "Orion creates indicators showing dimensions of scientific progress, like research diversity."
      }
    />
  );
};
