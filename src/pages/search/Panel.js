/** @jsx jsx */
/** @jsxFrag Fragment */

import styled from "@emotion/styled";
import { jsx } from "@emotion/core";
import { Fragment, useRef, useLayoutEffect } from "react";

import { Row, Column } from "../../components/shared/layout";
import Toggle from "../../components/shared/toggle";
import Input from "./results/Input";

const Option = styled("div")`
  margin-top: ${(props) => props.theme.spacing.large};
`;

const FilterOptions = ({ onChange = () => {} }) => (
  <>
    <Option>
      Sort papers by{": "}
      <Toggle
        values={["citations", "date", "relevance"]}
        selected={"relevance"}
        onChange={(value) => console.log(value)}
      />
    </Option>
    <Option>
      Show{": "}
      <Toggle
        values={[25, 50, 100]}
        selected={100}
        onChange={(value) => console.log(value)}
      />{" "}
      results
    </Option>
  </>
);

const Panel = ({
  type,
  // query = ``,
  onSearch,
  onSearchOptionChange,
  expanded = false,
}) => {
  const searchRef = useRef(``);
  useLayoutEffect(() => {
    const onSearchEnter = document.addEventListener("keyup", (e) => {
      e.preventDefault();
      switch (e.key) {
        case "Enter":
          searchRef.current && onSearch(searchRef.current.value);
          break;
        default:
          break;
      }
    });

    return function cleanup() {
      document.removeEventListener("keyup", onSearchEnter);
    };
  }, [onSearch]);

  return (
    <Column>
      {/* <Row>
        Searching by abstract utilizes word embeddings and fast similarity
        search (FAISS), to retrieve the most semantically similar abstracts to
        the one provided.
      </Row> */}
      <Input
        rows={5}
        placeholder={"Search for academic papers..."}
        ref={searchRef}
      />
      {/* {expanded && <FilterOptions />} */}
    </Column>
  );
};

export default Panel;
