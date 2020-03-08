/** @jsx jsx */
import React from "react";
import { css, jsx } from "@emotion/core";
import { Route, Switch } from "react-router-dom";
// import { Query } from "@apollo/react-components";

import { PageLayout } from "../../components/shared/layout";
import CountryProfile from "./country";
import TopicProfile from "./topic";

const Profile = () => {
  // const topics = useOrionData().topics.map(t => t.topic);

  return (
    <PageLayout
      css={css`
        padding-bottom: 0;
      `}
    >
      <Switch>
        <Route exact path={["/profile/country"]} component={CountryProfile} />
        <Route exact path={["/profile/topic"]} component={TopicProfile} />
      </Switch>
    </PageLayout>
  );
};

export default Profile;
