/** @jsx jsx */
import React from "react";
import { css, jsx } from "@emotion/core";
import { Route, Switch } from "react-router-dom";
import { Query } from "@apollo/react-components";

import { PageLayout } from "../../components/shared/layout";
import CountryProfile from "./country";
import TopicProfile from "./topic";
import DiversityIndex from "./diversity-index";
import { DIVERSITY_TOP_TOPICS } from "../../queries";
import { useOrionData } from "../../OrionData.context";

const Profile = () => {
  const topics = useOrionData().topics.map(t => t.topic);

  return (
    <PageLayout
      css={css`
        padding-bottom: 0;
      `}
    >
      <Switch>
        <Route
          exact
          path={["/profile"]}
          render={() => {
            return (
              <Query query={DIVERSITY_TOP_TOPICS} variables={{ topics }}>
                {({ loading, error, data }) => {
                  if (loading) return null;
                  if (error) console.error(error);
                  console.log(data.view_diversity_by_country);
                  return (
                    <DiversityIndex data={data.view_diversity_by_country} />
                  );
                }}
              </Query>
            );
          }}
        />
        <Route exact path={["/profile/country"]} component={CountryProfile} />
        <Route exact path={["/profile/topic"]} component={TopicProfile} />
      </Switch>
    </PageLayout>
  );
};

export default Profile;
