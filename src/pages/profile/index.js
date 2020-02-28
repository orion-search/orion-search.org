/** @jsx jsx */
import React from "react";
import { css, jsx } from "@emotion/core";
import { Route, Switch } from "react-router-dom";
import { Query } from "@apollo/react-components";

import { PageLayout } from "../../components/layout";
import CountryProfile from "./country";
import TopicProfile from "./topic";
import DiversityIndex from "./diversity-index";

const Profile = () => {
  return (
    <PageLayout
      css={css`
        // height: 100vh;
      `}
    >
      <Switch>
        <Route exact path={["/profile"]} component={DiversityIndex} />
        <Route exact path={["/profile/country"]} component={CountryProfile} />
        <Route exact path={["/profile/topic"]} component={TopicProfile} />
      </Switch>
    </PageLayout>
  );
};

export default Profile;
