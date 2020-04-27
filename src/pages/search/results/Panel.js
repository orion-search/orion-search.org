/** @jsx jsx */
import styled from "@emotion/styled";
import { jsx } from "@emotion/core";
import { useRef, useLayoutEffect } from "react";

import { Row, Column } from "../../../components/shared/layout";
import Toggle from "../../../components/shared/toggle";
import Input from "./Input";

const Option = styled("div")`
  margin-top: ${(props) => props.theme.spacing.large};
`;

const Panel = ({ type, onSearch, onSearchOptionChange }) => {
  const searchRef = useRef("");
  useLayoutEffect(() => {
    const onSearchEnter = document.addEventListener("keyup", (e) => {
      e.preventDefault();
      switch (e.key) {
        case "Enter":
          onSearch(searchRef.current.value);
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
    <Column width={1 / 3}>
      <Row>
        Searching by abstract utilizes word embeddings and fast similarity
        search (FAISS), to retrieve the most semantically similar abstracts to
        the one provided.
      </Row>
      <Input placeholder={"Search for something..."} ref={searchRef} />
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
    </Column>
  );
};

export default Panel;
