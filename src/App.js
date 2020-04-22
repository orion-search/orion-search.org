import { hot } from "react-hot-loader/root";
import React from "react";
import { Route, Switch } from "react-router-dom";

import { useOrionData } from "./OrionData.context";
import Diversity from "./pages/diversity/";
// import Explore from "./pages/explore/";
import LatentSpace from "./layouts/LatentSpace";
import Landing from "./pages/landing/";
import Profile from "./pages/profile/";
// import Search from "./pages/search/";
import Search from "./layouts/Search";
import { urls } from "./utils";

function App() {
  const { stage } = useOrionData();

  return (
    <Switch>
      <Route exact path={[urls.root]} component={Landing} />
      <Route
        exact
        path={[urls.diversity]}
        render={() => {
          stage.views.particles.viz.hide();

          return <Diversity />;
        }}
      />
      <Route
        exact
        path={[urls.explore]}
        render={({ location }) => {
          stage.views.particles.viz.show();
          return <LatentSpace papers={location?.state?.filters?.ids || []} />;
        }}
      />
      <Route path={urls.profile} component={Profile} />
      <Route
        path={urls.search}
        render={({ location }) => {
          stage.views.particles.viz.hide();
          return <Search papers={location?.state?.papers || []} />;
        }}
      />
    </Switch>
  );
}

export default hot(App);
