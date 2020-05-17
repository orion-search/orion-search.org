/** @jsx jsx */
import styled from "@emotion/styled";
import { css, jsx } from "@emotion/core";
import { useSpring, animated } from "react-spring";

import { Row } from "../layout";
import { formatDate, parseDate, fadeInUp } from "../../../utils";

const Wrapper = styled(animated.div)`
  border-bottom: ${(props) =>
    props.border
      ? `${props.border}px solid ${props.theme.colors.white}`
      : `none`};
  flex-wrap: wrap;
  padding: ${(props) => `${props.theme.spacing[props.pv || "none"]}`} 0;
  box-sizing: border-box;

  &:first-of-type {
    padding-top: 0;
  }
`;

const Flex = styled("div")`
  display: flex;
`;

const Title = styled(Flex)`
  display: flex;
  font-size: ${(props) => `${props.theme.type.sizes[props.size || "huge"]}`};
  margin: ${(props) => `${props.theme.type.sizes.normal}`} 0;
`;

const Authors = styled(Flex)`
  display: flex;
  flex-wrap: wrap;
  font-size: ${(props) => `${props.theme.type.sizes.normal}`};
`;

const Author = styled("div")`
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer;
  margin-right: ${(props) => `${props.theme.spacing.large}`};
  &:last-child {
    margin-right: 0;
  }
`;

const Date = styled(Flex)`
  margin-right: ${(props) => `${props.theme.spacing.huge}`};
`;

const Citations = styled(Flex)``;

const Publisher = styled(Flex)``;

const Topics = styled(Flex)``;

const Topic = styled(Flex)`
  cursor: pointer;
  font-weight: bold;
  margin-right: ${(props) => `${props.theme.spacing.large}`};
  background-color: ${(props) => `${props.theme.colors.white}`};
  color: ${(props) => `${props.theme.colors.black}`};
  box-sizing: border-box;
  padding: ${(props) =>
    `${props.theme.spacing.tiny} ${props.theme.spacing.small}`};
  &:last-child {
    margin-right: 0;
  }
`;

const MAX_AUTHORS = 20;
const MAX_TOPICS = 4;

export const PaperReducedDetail = ({ data }) => {
  const wrapperAnimation = useSpring(fadeInUp);
  const { title, date, citations } = data;
  const dateString = formatDate(parseDate(date));

  return (
    <Wrapper border={1} pv={"small"} style={wrapperAnimation}>
      <Title
        css={(props) =>
          css`
            margin: ${props.spacing.tiny} 0;
          `
        }
        size={"normal"}
      >
        {title}
      </Title>
      <Row
        mv={"none"}
        css={css`
          justify-content: start;
        `}
      >
        <Date>{dateString}</Date>
        <Citations>
          {citations
            ? citations > 1
              ? `${citations} citations`
              : `${citations} citation`
            : `Not yet cited`}
        </Citations>
      </Row>
    </Wrapper>
  );
};

const Paper = ({ data }) => {
  const wrapperAnimation = useSpring(fadeInUp);
  const { title, date, authors, topics, citations, publisher } = data;
  const dateString = formatDate(parseDate(date));
  return (
    <Wrapper border={2} pv={"huge"} style={wrapperAnimation}>
      <Row
        css={css`
          justify-content: start;
        `}
      >
        <Date>{dateString}</Date>
        <Citations>
          {citations
            ? citations > 1
              ? `${citations} citations`
              : `${citations} citation`
            : `Not yet cited`}
        </Citations>
      </Row>
      <Row>
        <Authors>
          {authors.map(
            ({ author }, i) =>
              i < MAX_AUTHORS && (
                <Author key={`paper-author-${author.name}`}>
                  {author.name}
                </Author>
              )
          )}
        </Authors>
      </Row>
      <Title size={"huge"}>{title}</Title>
      <Row>
        <Topics>
          {topics.map(
            ({ topic }, i) =>
              i < MAX_TOPICS && (
                <Topic key={`paper-topic-${topic.name}`}>{topic.name}</Topic>
              )
          )}
        </Topics>
      </Row>
      <Row>
        <Publisher>{publisher} ⏎</Publisher>
      </Row>
    </Wrapper>
  );
};
export default Paper;
