import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { PageLayout, Row, Column, Title } from "../../components/shared/layout";
import { Query } from "@apollo/react-components";

import Toggle from "../../components/shared/toggle";
import { PAPER_METADATA } from "../../queries";
import Results from "./Results";
import Input from "./Input";

const Search = () => {
  const searchRef = useRef("");
  const [query, setQuery] = useState("");
  // const [papers, setPapers] = useState([]);
  const [ids, setIds] = useState([]);

  useLayoutEffect(() => {
    const onSearchEnter = document.addEventListener("keyup", e => {
      e.preventDefault();
      switch (e.key) {
        case "Enter":
          console.log("Enter pressed");
          setQuery(searchRef.current.value);
          break;
        default:
          break;
      }
    });

    return function cleanup() {
      document.removeEventListener("keyup", onSearchEnter);
    };
  }, []);

  useEffect(() => {
    searchRef &&
      fetch(
        `${
          process.env.REACT_APP_ORION_SEARCH_URL
        }?query=${query}&results=${100}`
      )
        .then(d => d.json())
        .then(data => {
          const ids = data["I"].map(d => parseInt(d));
          setIds(ids);
        });
  }, [query]);

  // const onChange = () => {
  // searchRef.current.value.length && setQuery(searchRef.current.value);
  // };

  return (
    <PageLayout noPaddingBottom>
      <Title>
        Search by{" "}
        <Toggle
          options={["Abstract", "Keyword"]}
          selected={"Abstract"}
          onChange={value => console.log(value)}
        />
      </Title>
      <Row>
        <Column width={1 / 3}>
          <p>
            Searching by abstract utilizes word embeddings and fast similarity
            search (FAISS), to retrieve the most semantically similar abstracts
            to the one provided.
          </p>
          <Input placeholder={"Search for something..."} ref={searchRef} />
          <div noSpaceBetween>
            Sort papers by{": "}
            <Toggle
              options={["citations", "date", "relevance"]}
              selected={"relevance"}
              onChange={value => console.log(value)}
            />
          </div>
          <div>
            Show{": "}
            <Toggle
              options={[25, 50, 100]}
              selected={100}
              onChange={value => console.log(value)}
            />{" "}
            results
          </div>
        </Column>
        <Column width={2.5 / 4}>
          {ids.length && (
            <Query query={PAPER_METADATA} variables={{ ids }}>
              {({ loading, error, data }) => {
                if (loading) return null;
                if (error) throw error;
                if (!data.papers) return null;
                console.log(data.papers);
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
