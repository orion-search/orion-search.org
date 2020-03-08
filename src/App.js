import { hot } from "react-hot-loader/root";
import React from "react";
import { Route, Switch } from "react-router-dom";

import Diversity from "./pages/diversity/";
import Explore from "./pages/explore/";
import Landing from "./pages/landing/";
import Profile from "./pages/profile/";

function App() {
  return (
    <Switch>
      <Route exact path={["/"]} component={Landing} />
      <Route exact path={["/diversity"]} component={Diversity} />
      <Route exact path={["/explore"]} component={Explore} />
      <Route path={"/profile"} component={Profile} />
    </Switch>
  );
}

export default hot(App);
