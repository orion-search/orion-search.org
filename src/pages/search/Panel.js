/** @jsx jsx */
/** @jsxFrag Fragment */

import styled from "@emotion/styled";
import { jsx, css } from "@emotion/core";
import { forwardRef, useRef, useLayoutEffect } from "react";

import { Column } from "../../components/shared/layout";
// import Toggle from "../../components/shared/toggle";
import Input from "../../components/shared/input";
import { Button } from "../../components/shared/button";

// const Option = styled("div")`
//   margin-top: ${(props) => props.theme.spacing.large};
// `;

let SearchBarInput = styled(Input)`
  font-size: ${(props) => `${props.theme.type.sizes.large}`};
  font-family: ${(props) => props.theme.type.fonts.regular};
`;

const SearchBar = forwardRef(({ onClick = () => {} }, ref) => (
  <div
    css={css`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    `}
  >
    <SearchBarInput
      ref={ref}
      css={css`
        width: 85%;
      `}
    />
    <Button
      css={css`
        align-self: center;
      `}
      onClick={onClick}
    >
      Search
    </Button>
  </div>
));

// const FilterOptions = ({ onChange = () => {} }) => (
//   <>
//     <Option>
//       Sort papers by{": "}
//       <Toggle
//         values={["citations", "date", "relevance"]}
//         selected={"relevance"}
//       />
//     </Option>
//     <Option>
//       Show{": "}
//       <Toggle
//         values={[25, 50, 100]}
//         selected={100}
//       />{" "}
//       results
//     </Option>
//   </>
// );

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
      <SearchBar
        rows={2}
        placeholder={"Search for academic papers..."}
        ref={searchRef}
        onClick={() => onSearch(searchRef.current.value)}
      />
      {/* {expanded && <FilterOptions />} */}
    </Column>
  );
};

export default Panel;
