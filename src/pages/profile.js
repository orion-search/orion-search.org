import React from "react";

import { PageLayout } from "../components/layout";
import Timeline from "../components/visualizations/timeline";
import Dropdown from "../components/dropdown";

const Profile = () => {
  return (
    <PageLayout>
      <Timeline />
      <Dropdown options={["a", "b", "c"]} />
    </PageLayout>
  );
};

export default Profile;
