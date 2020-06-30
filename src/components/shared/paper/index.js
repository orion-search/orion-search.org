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

  overflow-x: hidden;

  & a {
    text-decoration: none;
  }
`;

const Flex = styled("div")`
  display: flex;
`;

const Title = styled(Flex)`
  display: flex;
  font-size: ${(props) => `${props.theme.type.sizes[props.size || "huge"]}`};
  font-weight: bold;
  margin-top: ${(props) => `${props.theme.spacing.tiny}`};
  margin-bottom: ${(props) => `${props.theme.spacing.tiny}`};

  color: ${(props) =>
    props.compact ? props.theme.colors.white : props.theme.colors.orange};
  & a {
    color: ${(props) =>
      props.compact ? props.theme.colors.white : props.theme.colors.orange};
  }
`;

const Abstract = styled(Flex)`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;

  max-width: 80ch;

  font-size: ${(props) => `${props.theme.type.sizes.small}`};
  margin: ${(props) =>
    `${props.theme.spacing.tiny} 0 ${props.theme.spacing.tiny} 0`};
`;

const Authors = styled(Flex)`
  display: flex;
  flex-wrap: wrap;
  color: ${(props) => props.theme.colors.gray};
  font-size: ${(props) => `${props.theme.type.sizes.normal}`};
`;

const Author = styled("div")`
  font-size: ${(props) => `${props.theme.type.sizes.small}`};
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

const Publisher = styled(Flex)`
  margin-right: ${(props) => `${props.theme.spacing.huge}`};
`;

const Topics = styled(Flex)``;

const Topic = styled(Flex)`
  cursor: pointer;
  font-size: ${(props) => `${props.theme.type.sizes.small}`};
  line-height: ${(props) => `${props.theme.type.sizes.small}`};
  background: ${(props) => props.theme.gradients.red};
  color: ${(props) => `${props.theme.colors.white}`};
  box-sizing: border-box;
  border-radius: 6px;
  padding: ${(props) =>
    `${props.theme.spacing.tiny} ${props.theme.spacing.normal}`};
  margin-right: ${(props) => `${props.theme.spacing.large}`};
  &:last-child {
    margin-right: 0;
  }
`;

const MAX_AUTHORS = 20;
const MAX_TOPICS = 4;

export const PaperReducedDetail = ({ data }) => {
  const wrapperAnimation = useSpring(fadeInUp);
  const { original_title, date, citations } = data;
  const dateString = formatDate(parseDate(date));

  return (
    <Wrapper
      css={(theme) =>
        css`
          border-color: ${theme.colors.red};
        `
      }
      border={1}
      pv={"small"}
      style={wrapperAnimation}
    >
      <Title
        compact
        css={(props) =>
          css`
            margin: ${props.spacing.tiny} 0;
          `
        }
        size={"normal"}
      >
        {original_title}
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
  const {
    original_title,
    date,
    abstract,
    authors,
    source,
    topics,
    citations,
    publisher,
  } = data;
  const dateString = formatDate(parseDate(date));
  return (
    <Wrapper border={2} pv={"large"} style={wrapperAnimation}>
      <Title size={"large"}>
        <a href={source} target="__blank">
          {original_title}
        </a>
      </Title>
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
      <Row
        css={css`
          justify-content: start;
          margin: 0;
        `}
      >
        <Date>{dateString}</Date>
        <Publisher>{publisher}</Publisher>
        <Citations>
          {citations
            ? citations > 1
              ? `${citations} citations`
              : `${citations} citation`
            : `Not yet cited`}
        </Citations>
      </Row>
      <Row>
        <Abstract>{abstract}</Abstract>
      </Row>
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
    </Wrapper>
  );
};
export default Paper;
