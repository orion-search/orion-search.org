import { hot } from "react-hot-loader/root";
import React from "react";
import { Route, Switch } from "react-router-dom";

import Diversity from "./pages/diversity/";
import Explore from "./pages/explore/";
import Landing from "./pages/landing/";
import Networks from "./pages/networks";
import Profile from "./pages/profile/";
import { urls } from "./utils";

function App() {
  return (
    <Switch>
      <Route exact path={[urls.root]} component={Landing} />
      <Route exact path={[urls.diversity]} component={Diversity} />
      <Route exact path={[urls.explore]} component={Explore} />
      <Route exact path={[urls.networks]} component={Networks} />
      <Route path={urls.profile} component={Profile} />
    </Switch>
  );
}

export default hot(App);
