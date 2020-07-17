import React from "react";
import { Photograph } from ".";
import { Row } from "../layout";
import src from "../../../assets/img/photo-zac.jpg";

export default {
  title: "Design System/Atoms/Photograph",
  component: Photograph,
};

export const Default = () => {
  return (
    <Row width={1 / 3}>
      <Photograph square src={src} />
    </Row>
  );
};
