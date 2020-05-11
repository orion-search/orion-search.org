import React, { useRef, useLayoutEffect, useCallback, useState } from "react";
import styled from "@emotion/styled";

import Paper from "../../components/shared/paper";
import Toggle from "../../components/shared/toggle";
// import { blurEdges } from "../../components/shared/layout";
import { LinkButton } from "../../components/shared/button";
import { clamp, urls, accessors } from "../../utils";

// import { useLayoutEffect } from "react";

// const Wrapper = styled("div")`
//   overflow: scroll;
//   box-sizing: border-box;
//   margin: -${(props) => props.theme.spacing.normal};
//   padding: ${(props) =>
//     `${props.theme.spacing.normal} ${props.theme.spacing.large} 0 0`};

//   ${blurEdges};
// `;

const PaginationWrapper = styled("div")`
  margin: ${(props) => props.theme.spacing.normal} 0;
  font-size: ${(props) => props.theme.type.sizes.huge};
`;

const Results = ({ data, numResults = 100, resultsPerPage = 10 }) => {
  const wrapperRef = useRef();
  const [offset, setOffset] = useState(0);
  const onChangeOffset = useCallback(
    (e) => {
      e.preventDefault();
      switch (e.key) {
        case "ArrowLeft":
          setOffset(
            clamp(offset - resultsPerPage, 0, numResults - resultsPerPage)
          );
          break;
        case "ArrowRight":
          setOffset(
            clamp(offset + resultsPerPage, 0, numResults - resultsPerPage)
          );
          break;
        default:
          break;
      }
    },
    [offset, resultsPerPage, numResults]
  );

  const goToPage = useCallback(
    (e) => {
      console.log((e - 1) * resultsPerPage);
      setOffset((e - 1) * resultsPerPage);
    },
    [resultsPerPage]
  );

  useLayoutEffect(() => {
    document.addEventListener("keyup", onChangeOffset);
    //   const { y } = wrapperRef.current.getBoundingClientRect();
    //   wrapperRef.current.style.height = `${window.innerHeight - y}px`;
    return function cleanup() {
      document.removeEventListener("keyup", onChangeOffset);
    };
  }, [onChangeOffset]);

  const PaginationBar = () => (
    <PaginationWrapper>
      Page {` `}
      <Toggle
        values={Array(Math.ceil(numResults / resultsPerPage))
          .fill(0)
          .map((d, i) => i + 1)}
        selected={parseInt(offset / resultsPerPage + 1)}
        separator={"/"}
        onChange={goToPage}
      />
    </PaginationWrapper>
  );

  return (
    <div ref={wrapperRef}>
      <LinkButton
        to={{
          pathname: urls.explore,
          state: {
            filters: {
              ids: data.map((d) => accessors.types.id(d)),
            },
          },
        }}
      >
        Explore Cluster
      </LinkButton>
      <PaginationBar />
      {data.slice(offset, offset + resultsPerPage).map((p) => (
        <Paper key={`paper-${p.title}`} data={p} />
      ))}
      <PaginationBar />
    </div>
  );
};

export default Results;
