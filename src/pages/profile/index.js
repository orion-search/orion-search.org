import React from "react";
import { Route, Switch } from "react-router-dom";

import { PageLayout } from "../../components/layout";
import CountryProfile from "./country";
import TopicProfile from "./topic";

const Profile = () => {
  return (
    <PageLayout>
      <Switch>
        <Route exact path={["/profile/country"]} component={CountryProfile} />
        <Route exact path={["/profile/topic"]} component={TopicProfile} />
      </Switch>
    </PageLayout>
  );
};

export default Profile;
