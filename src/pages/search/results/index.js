/**
 * @todo no need to double-fetch paper metadata,
 * when the paper prop is there
 */

import { Query } from "@apollo/react-components";
import React, { useEffect, useCallback, useState } from "react";
import {
  PageLayout,
  Row,
  Column,
  Title,
} from "../../../components/shared/layout";

import { accessors, urls } from "../../../utils";
import Toggle from "../../../components/shared/toggle";
import { LinkButton } from "../../../components/shared/button";
import { PAPER_METADATA } from "../../../queries";
import Panel from "../Panel";
import Results from "../Results";

const isSearchType = (type) => (currentSearch) => currentSearch === type;
const isKeywordSearch = isSearchType("Keyword");
const isAbstractSearch = isSearchType("Abstract");

const Search = ({ papers = [] }) => {
  const [query, setQuery] = useState("");
  const [ids, setIds] = useState(
    papers ? papers.map((p) => accessors.types.id(p)) : []
  );
  const [searchMode, setSearchMode] = useState(
    papers.length ? `Keyword` : `Abstract`
  );

  useEffect(() => {
    if (query === "" || searchMode === `Keyword`) return;
    fetch(
      `${process.env.REACT_APP_ORION_SEARCH_URL}?query=${query}&results=${100}`
    )
      .then((d) => d.json())
      .then((data) => {
        const ids = data["I"].map((d) => parseInt(d));
        console.log(ids);
        setIds(ids);
      });
  }, [query, searchMode]);

  const onSearchEnter = useCallback((value) => {
    setQuery(value);
  }, []);

  return (
    <PageLayout noPaddingBottom>
      <Title>
        Search by{" "}
        <Toggle
          values={["Abstract", "Keyword"]}
          selected={searchMode}
          onChange={(value) => setSearchMode(value)}
        />
      </Title>
      {/* { */}
      // isKeywordSearch(searchMode) &&
      <LinkButton
        to={{
          pathname: urls.explore,
          state: {
            filters: {
              ids,
            },
          },
        }}
      >
        EXPLORE CLUSTER
      </LinkButton>
      // }
      <Row>
        <Panel type={searchMode} onSearch={onSearchEnter} />
        <Column width={2.5 / 4}>
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

                return <Results data={reindexed} />;
              }}
            </Query>
          )}
        </Column>
      </Row>
    </PageLayout>
  );
};

export default Search;
