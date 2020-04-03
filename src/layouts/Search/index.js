import React, { useEffect, useCallback, useState } from "react";
import { PageLayout, Row, Column, Title } from "../../components/shared/layout";
import { Query } from "@apollo/react-components";

import Toggle from "../../components/shared/toggle";
import { PAPER_METADATA } from "../../queries";
import Panel from "./Panel";
import Results from "./Results";

const Search = () => {
  const [query, setQuery] = useState("");
  // const [papers, setPapers] = useState([]);
  const [ids, setIds] = useState([]);

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_ORION_SEARCH_URL}?query=${query}&results=${100}`
    )
      .then(d => d.json())
      .then(data => {
        const ids = data["I"].map(d => parseInt(d));
        setIds(ids);
      });
  }, [query]);

  const onSearchEnter = useCallback(value => {
    setQuery(value);
  }, []);

  return (
    <PageLayout noPaddingBottom>
      <Title>
        Search by{" "}
        <Toggle
          values={["Abstract", "Keyword", "Topic Intersection (experimental)"]}
          selected={"Abstract"}
          onChange={value => console.log(value)}
        />
      </Title>
      <Row>
        <Panel type={"Abstract"} onSearch={onSearchEnter} />
        <Column width={2.5 / 4}>
          {ids.length && (
            <Query query={PAPER_METADATA} variables={{ ids }}>
              {({ loading, error, data }) => {
                if (loading) return null;
                if (error) throw error;
                if (!data.papers) return null;
                return <Results data={data.papers} />;
              }}
            </Query>
          )}
        </Column>
      </Row>
    </PageLayout>
  );
};

export default Search;
