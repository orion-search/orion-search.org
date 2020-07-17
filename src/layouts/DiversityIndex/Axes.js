/** @jsx jsx */
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { animated } from "react-spring";
import { range } from "d3";

import { formatTwoDecimalPoints } from "../../utils";
import { layout } from "../../visualizations/DiversityIndex/geometry";

const Wrapper = styled(animated.div)`
  pointer-events: none;
  display: flex;
  flex-wrap: wrap;
  height: 5vh;
  position: absolute;
`;

const AxisWrapper = styled(animated.div)`
  display: flex;
  box-sizing: border-box;
  height: 4px;
  z-index: -100;
  border-radius: 2px;
`;

const Labels = styled(animated.div)`
  display: flex;
  width: 100%;
  align-self: center;
  justify-content: space-between;
  text-transform: uppercase;
  margin-top: ${(props) => props.theme.spacing.small};
`;

export const XAxis = ({ metric = ``, min, max }) => {
  const Container = styled(Wrapper)`
    flex-direction: column;
    bottom: 0;
    left: 0;
    /* background-color: rgba(0, 0, 0, 0.75); */
    margin-left: ${100 - layout.pointSegment.widthRatio * 100}%;
    width: calc(
      ${layout.pointSegment.widthRatio * 100}% -
        ${(props) => props.theme.layout.page.side}
    );
  `;

  const Axis = styled(AxisWrapper)`
    background: ${(props) => props.theme.gradients.white};
    height: 4px;
    justify-content: flex-end;
  `;

  return (
    <Container>
      <Axis />
      <Labels>
        <div>{formatTwoDecimalPoints(min)}</div>
        <div>
          {metric}
          {` `}[?]
        </div>
        <div>{formatTwoDecimalPoints(max)}</div>
      </Labels>
    </Container>
  );
};

export const YAxis = ({ metric = ``, min, max, colorScale }) => {
  const Container = styled(Wrapper)`
    flex-direction: row;
    right: 45px;
    top: 20vh;
    height: fit-content;
    width: 60vh;
    justify-content: space-around;
    transform: rotate(-90deg);
    transform-origin: 100% 0;
  `;

  const generateGradientString = () => {
    const g = range(0, 1.01, 0.1)
      .map(
        (i) =>
          `${colorScale(i * colorScale.domain()[1])} ${(i * 100).toFixed(0)}%`
      )
      .join(", ");
    console.log();
    return `linear-gradient(90deg, ${g});`;
  };

  const Axis = styled(AxisWrapper)`
    background: ${generateGradientString()};
    height: 4px;
    width: 100%;
    margin-bottom: ${(props) => props.theme.spacing.tiny};
  `;

  return (
    <Container>
      <Axis>{/* <GradientSVG ref={svgRef} /> */}</Axis>
      <Labels>
        <div>{formatTwoDecimalPoints(min)}</div>
        <div>
          {metric}
          {` `}[?]
        </div>
        <div>{formatTwoDecimalPoints(max)}</div>
      </Labels>
    </Container>
  );
};
