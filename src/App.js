import React from "react";
import { Route, Switch } from "react-router-dom";
// import { Landing, Explore, Diversity } from "./pages";
import Landing from "./pages/landing";
import Explore from "./pages/explore";
import Diversity from "./pages/diversity";

function App() {
  return (
    <Switch>
      <Route exact path={["/"]} component={Landing} />
      <Route exact path={["/explore"]} component={Explore} />
      <Route exact path={["/diversity"]} component={Diversity} />
    </Switch>
  );
  // return <h1>Hi</h1>;
}

export default App;