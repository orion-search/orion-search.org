import { hot } from "react-hot-loader/root";
import React from "react";
import { Route, Switch } from "react-router-dom";

import Diversity from "./pages/diversity";
import Explore from "./pages/explore";
import Hierarchy from "./pages/hierarchy";
import Network from "./pages/network";
import Landing from "./pages/landing";
import Output from "./pages/output";
import Profile from "./pages/profile";
import Topics from "./pages/topics";

function App() {
  return (
    <Switch>
      <Route exact path={["/"]} component={Landing} />
      <Route exact path={["/diversity"]} component={Diversity} />
      <Route exact path={["/explore"]} component={Explore} />
      <Route exact path={["/hierarchy"]} component={Hierarchy} />
      <Route exact path={["/network"]} component={Network} />
      <Route exact path={["/output"]} component={Output} />
      <Route
        exact
        path={["/profile/country/:countryCode?"]}
        render={({ match }) => {
          const {
            params = { countryCode: match.params.countryCode || "USA" }
          } = match;

          return <Profile country={params.country} match={match} />;
        }}
      />
      <Route
        exact
        path={["/profile/topic/:topic"]}
        render={({ match }) => {
          const { params = { topic: match.params.topic } } = match;

          return params.topic ? (
            <Profile topic={params.topic} match={match} />
          ) : null;
        }}
      />
      <Route exact path={["/topics"]} component={Topics} />
    </Switch>
  );
}

export default hot(App);
