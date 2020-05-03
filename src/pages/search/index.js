import React, { useEffect, useCallback, useState } from "react";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { Query } from "@apollo/react-components";

import { PageLayout, Title } from "../../components/shared/layout";
import Toggle from "../../components/shared/toggle";
import Panel from "./Panel";
import Results from "./Results";
import { PAPER_METADATA } from "../../queries";
import { urls, accessors } from "../../utils";

export const searchModes = [
  `Abstract`,
  `Keyword`,
  `Topic Intersection (experimental)`,
];

export default ({ papers }) => {
  const [query, setQuery] = useState(``);
  const [numResults, setNumResults] = useState(100);
  // const [ids, setIds] = useState(
  //   papers ? papers.map((p) => accessors.types.id(p)) : []
  // );

  const [searchMode, setSearchMode] = useState(searchModes[0]);

  const history = useHistory();
  const { pathname } = useLocation();

  useEffect(() => {
    if (query === "" || searchMode === `Keyword`) return;
    fetch(
      `${process.env.REACT_APP_ORION_SEARCH_URL}/vector-search?query=${query}&results=${numResults}`
    )
      .then((d) => d.json())
      .then((data) => {
        console.log(data);
        history.push(urls.search.results, {
          papers: data["I"].map((d) => ({ id: parseInt(d) })),
        });
      });
  }, [history, numResults, query, searchMode]);

  const onSearchEnter = useCallback((value) => {
    setQuery(value);
  }, []);

  // add Router Switch here
  return (
    <PageLayout>
      <Title>
        Search by{" "}
        <Toggle
          values={searchModes}
          selected={searchMode}
          onChange={(value) => setSearchMode(value)}
        />
      </Title>
      <Panel
        expanded={pathname === urls.search.results}
        onSearch={onSearchEnter}
        // query={query}
        type={searchMode}
      />
      <Switch>
        <Route exact path={[urls.search.landing]} render={() => null} />
        <Route
          exact
          path={[urls.search.results]}
          render={() => {
            return (
              <SearchResults
                ids={papers.map((p) => accessors.types.id(p))}
                searchMode={searchMode}
                numResults={numResults}
                onSearchEnter={onSearchEnter}
              />
            );
          }}
        />
      </Switch>
    </PageLayout>
  );
};

const SearchResults = ({
  ids,
  searchMode,
  numResults,
  onSearchEnter = () => {},
}) => {
  return (
    <>
      {ids.length && (
        <Query query={PAPER_METADATA} variables={{ ids }}>
          {({ loading, error, data }) => {
            if (loading) return null;
            if (error) throw error;
            if (!data.papers) return null;

            // re-order based on provided ID query variables
            // which is essentially their similarity
            const reindexed = ids.map((id) =>
              data.papers.find((p) => accessors.types.id(p) === id)
            );
            return (
              <Results
                data={reindexed}
                numResults={Math.min(numResults, reindexed.length)}
              />
            );
          }}
        </Query>
      )}
    </>
  );
};
