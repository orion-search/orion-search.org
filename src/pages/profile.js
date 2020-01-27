import React from "react";

import { PageLayout } from "../components/layout";
import Timeline from "../components/visualizations/timeline";
import Dropdown from "../components/dropdown";
import List from "../components/list";
import Header from "../components/header";

const Profile = () => {
  return (
    <PageLayout>
      <Header title={"Diversity of Research / Entity Profile"} />
      <Timeline />
      <Dropdown values={["a", "b", "c"]} />
      <List
        title={"Top Authors"}
        values={["Zac Ioannidis", "Clement Rames", "Nick Kyrgios"]}
      />
    </PageLayout>
  );
};

export default Profile;
