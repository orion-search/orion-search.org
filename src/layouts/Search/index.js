import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { PageLayout, Row, Column, Title } from "../../components/shared/layout";
import Toggle from "../../components/shared/toggle";
import { PAPER_METADATA } from "../../queries";
import Paper from "./Paper";
import Input from "./Input";
import { Query } from "@apollo/react-components";

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
          console.log("setting Ids", ids);
          setIds(ids);
        });
  }, [query]);

  // const onChange = () => {
  // searchRef.current.value.length && setQuery(searchRef.current.value);
  // };

  return (
    <PageLayout>
      <Title>
        Search by{" "}
        <Toggle
          options={["Abstract", "Keyword"]}
          selected={"Abstract"}
          onChange={value => console.log(value)}
        />
      </Title>
      <Column width={1 / 3}>
        <p>This search engine / / /</p>
        <p>Add some methodology text here / / /</p>
      </Column>
      <Row>
        <Column width={1 / 2}>
          {/* <form onSubmit={handleSubmit}> */}
          <Input placeholder={"Search for something..."} ref={searchRef} />
          {/* </form> */}
        </Column>
      </Row>
      <Row>
        <Column width={1}>
          {ids.length && (
            <Query query={PAPER_METADATA} variables={{ ids }}>
              {({ loading, error, data }) => {
                if (loading) return null;
                if (error) throw error;
                if (!data.papers) return null;
                console.log(loading, error, data, "HELLO");

                return data.papers.map(p => (
                  <Paper key={`paper-${p.title}`} data={p} />
                ));
              }}
            </Query>
          )}
        </Column>
      </Row>
    </PageLayout>
  );
};

export default Search;
