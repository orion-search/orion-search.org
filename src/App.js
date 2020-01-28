import React from "react";
import { Route, Switch } from "react-router-dom";
// import { Landing, Explore, Diversity } from "./pages";
import Diversity from "./pages/diversity";
import Explore from "./pages/explore";
import Landing from "./pages/landing";
import Network from "./pages/network";
import Profile from "./pages/profile";

function App() {
  return (
    <Switch>
      <Route exact path={["/"]} component={Landing} />
      <Route exact path={["/explore"]} component={Explore} />
      <Route exact path={["/diversity"]} component={Diversity} />
      <Route exact path={["/network"]} component={Network} />
      <Route exact path={["/profile"]} component={Profile} />
    </Switch>
  );
  // return <h1>Hi</h1>;
}

export default App;
