/** @jsx jsx */
/** @jsxFrag Fragment */

import { jsx } from "@emotion/core";
import { useRef, useLayoutEffect } from "react";

import { SearchBar } from "../../components/shared/input";

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
    <SearchBar
      placeholder={"Search for academic papers..."}
      ref={searchRef}
      onClick={() => onSearch(searchRef.current.value)}
    />
  );
};

export default Panel;
