import React from "react";
import { Accordion } from ".";

export default {
  title: "Design System/Atoms/Accordion",
  component: Accordion,
};

export const Default = () => {
  return (
    <>
      <Accordion
        title={() => <h2>This is the first headline</h2>}
        content={() => <div>...and this is the content</div>}
      />
      <Accordion
        title={() => <h2>This is the second headline</h2>}
        content={() => <div>...and this is the content</div>}
      />
      <Accordion
        title={() => <h2>This is the third headline</h2>}
        content={() => <div>...and this is the content</div>}
      />
    </>
  );
};
