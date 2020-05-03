import React, { useRef, useLayoutEffect, useState } from "react";
import styled from "@emotion/styled";

import Paper from "../../components/shared/paper";
import { blurEdges } from "../../components/shared/layout";
import { clamp } from "../../utils";
import { useCallback } from "react";

// import { useLayoutEffect } from "react";

const Wrapper = styled("div")`
  overflow: scroll;
  box-sizing: border-box;
  margin: -${(props) => props.theme.spacing.normal};
  padding: ${(props) =>
    `${props.theme.spacing.normal} ${props.theme.spacing.large} 0 0`};

  ${blurEdges};
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

  useLayoutEffect(() => {
    document.addEventListener("keyup", onChangeOffset);
    //   const { y } = wrapperRef.current.getBoundingClientRect();
    //   wrapperRef.current.style.height = `${window.innerHeight - y}px`;
    return function cleanup() {
      document.removeEventListener("keyup", onChangeOffset);
    };
  }, [onChangeOffset]);

  return (
    <div ref={wrapperRef}>
      {data.slice(offset, offset + resultsPerPage).map((p) => (
        <Paper key={`paper-${p.title}`} data={p} />
      ))}
    </div>
  );
};

export default Results;
