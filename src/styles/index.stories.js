import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import theme from ".";

export default {
  title: "Design System/Atoms/Colors",
};

const Wrapper = styled(`div`)`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

const Tile = styled("div")`
  border-radius: 5px;
  width: 20px;
  height: 20px;
  margin: 5px;
  background: ${(props) => props.background || "fff"};
`;

const Bar = styled(`Tile`)`
  border-radius: 20px;
  height: 8px;
  width: 80%;
  background: ${(props) => props.background || "fff"};
`;

export const Gradients = () => {
  return (
    <>
      <h2>Primary Interface Gradients</h2>
      <Wrapper>
        <Tile background={theme.colors.red} />
        <Bar background={theme.gradients.red} />
        <Tile background={theme.colors.orange} />
      </Wrapper>
      <Wrapper>
        <Tile background={theme.colors.blue} />
        <Bar background={theme.gradients.blue} />
        <Tile background={theme.colors.purple} />
      </Wrapper>
      <h2>Data Visualization Color Scales</h2>
      <h3>To be filled in</h3>
    </>
  );
};
