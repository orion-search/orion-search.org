import { hot } from "react-hot-loader/root";
import React from "react";
import { Route, Switch } from "react-router-dom";

import { useOrionData } from "./OrionData.context";
import Diversity from "./pages/diversity/";
// import Explore from "./pages/explore/";
import LatentSpace from "./layouts/LatentSpace";
import Landing from "./pages/landing/";
import Profile from "./pages/profile/";
// import SearchResults from "./pages/search/results";
import Search from "./pages/search";
import { accessors, urls } from "./utils";

function App() {
  const { stage, diversity, crossfilter, papers } = useOrionData();

  return (
    <Switch>
      <Route exact path={[urls.root]} component={Landing} />
      <Route
        exact
        path={[urls.diversity]}
        render={() => {
          stage.views.particles.viz.hide();

          return <Diversity data={diversity} />;
        }}
      />
      <Route
        exact
        path={[urls.explore]}
        render={({ location }) => {
          // const {} = location.state.filters
          console.log(location.state);
          let filters = { topic: [], country: [] };
          let filteredPaperIds = location?.state?.filters?.ids || [];
          if (location?.state?.filters?.ids) {
            filteredPaperIds = location.state.filters.ids;
          } else if (location?.state?.filters) {
            const { ids, ...filterDimensions } = location?.state?.filters;
            const idsByDimension = Object.keys(
              filterDimensions
            ).map((dimension) =>
              filterDimensions[dimension].flatMap(
                (filterValue) =>
                  papers[accessors.filters[dimension]].find(
                    (p) => p[accessors.names[dimension]] === filterValue
                  )[accessors.names.ids]
              )
            );
            console.log(
              "Filtering on dimensions",
              filterDimensions,
              idsByDimension
            );
            filteredPaperIds = idsByDimension[0];
            filters = filterDimensions;
            // if (idsByDimension.length > 1) {
            //   crossfilter.dimensions(
            //     idsByDimension
            //   );
            //   crossfilter.compute().then(data => {
            //     // do something
            //   })
            // }
          }
          stage.views.particles.viz.show();
          return <LatentSpace papers={filteredPaperIds} filters={filters} />;
        }}
      />
      <Route path={urls.profile} component={Profile} />
      <Route
        exact
        path={[urls.search.landing, urls.search.results]}
        render={({ location }) => {
          stage.views.particles.viz.hide();
          stage.views.diversity.viz.hide();
          return <Search papers={location?.state?.papers || []} />;
        }}
      />
      {/* <Route
        exact
        path={urls.search.results}
        render={({ location }) => {
          stage.views.particles.viz.hide();
          return <SearchResults papers={location?.state?.papers || []} />;
        }}
      /> */}
    </Switch>
  );
}

export default hot(App);
