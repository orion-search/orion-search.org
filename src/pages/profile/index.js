/** @jsx jsx */
// import React from "react";
import { jsx } from "@emotion/core";
import { Route, Switch } from "react-router-dom";
// import { Query } from "@apollo/react-components";

import CountryProfile from "./country";
import TopicProfile from "./topic";
import { urls } from "../../utils";

const Profile = () => {
  // const topics = useOrionData().topics.map(t => t.topic);

  return (
    <Switch>
      <Route exact path={[urls.profileCountry]} component={CountryProfile} />
      <Route exact path={[urls.profileTopic]} component={TopicProfile} />
    </Switch>
  );
};

export default Profile;
