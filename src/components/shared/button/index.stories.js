import React from "react";
import { action } from "@storybook/addon-actions";
import { Button, MediumButton, SmallButton } from ".";

export default {
  title: "Design System/Atoms/Button",
  component: Button,
};

export const Large = () => (
  <Button onClick={action("clicked")}>Hello Button</Button>
);

export const Medium = () => (
  <MediumButton onClick={action("clicked")}>Hello Button</MediumButton>
);

export const Small = () => (
  <SmallButton onClick={action("clicked")}>Hello Button</SmallButton>
);
