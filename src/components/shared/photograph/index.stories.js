import React from "react";
import { Photograph } from ".";
import src from "../../../assets/img/photo-zac.jpg";

export default {
  title: "Design System/Atoms/Photograph",
  component: Photograph,
};

export const Default = () => {
  return <Photograph src={src} />;
};
