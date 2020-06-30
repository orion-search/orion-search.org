import React from "react";
import { action } from "@storybook/addon-actions";
import { Button, MediumButton, SmallButton } from ".";
import { withKnobs, boolean } from "@storybook/addon-knobs";

export default {
  title: "Design System/Atoms/Button",
  component: Button,
  decorators: [withKnobs],
};

export const Large = () => (
  <Button nofill={boolean("No Fill", false)} onClick={action("clicked")}>
    Button
  </Button>
);

export const Medium = () => (
  <MediumButton nofill={boolean("No Fill", false)} onClick={action("clicked")}>
    Button
  </MediumButton>
);

export const Small = () => (
  <SmallButton nofill={boolean("No Fill", false)} onClick={action("clicked")}>
    Button
  </SmallButton>
);
