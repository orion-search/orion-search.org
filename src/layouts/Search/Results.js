import React, { useRef } from "react";
import Paper from "./Paper";
import { blurEdges } from "../../components/shared/layout";

import styled from "@emotion/styled";
import { useLayoutEffect } from "react";

const Wrapper = styled("div")`
  overflow: scroll;
  box-sizing: border-box;
  margin: -${(props) => props.theme.spacing.normal};
  padding: ${(props) =>
    `${props.theme.spacing.normal} ${props.theme.spacing.large} 0 0`};

  ${blurEdges};
`;

const Results = ({ data }) => {
  const wrapperRef = useRef();

  useLayoutEffect(() => {
    const { y } = wrapperRef.current.getBoundingClientRect();
    wrapperRef.current.style.height = `${window.innerHeight - y}px`;
  }, []);

  return (
    <Wrapper ref={wrapperRef}>
      {data.map((p) => (
        <Paper key={`paper-${p.title}`} data={p} />
      ))}
    </Wrapper>
  );
};

export default Results;
