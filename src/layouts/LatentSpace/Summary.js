/** @jsx jsx */

import { Fragment } from "react";
import { css, jsx } from "@emotion/core";
import { Query } from "@apollo/react-components";
import { scaleLog, extent } from "d3";
import { Link } from "react-router-dom";

import { formatThousands, sortCitationsDesc, urls } from "../../utils";
import { PAPER_METADATA } from "../../queries";

import { Flex, Row } from "../../components/shared/layout";
import { MediumButton } from "../../components/shared/button";
import { PaperReducedDetail } from "../../components/shared/paper";

const Summary = ({ onFilterReset = () => {}, paperIds, showPapers = 5 }) => {
  // const [topTopics, setTopTopics] = useState(topTopics);
  if (!paperIds.length) return null;

  const p = formatThousands(paperIds.length);

  // don't crash Hasura
  const maxQueriedPapers = 500;

  return (
    <Query
      query={PAPER_METADATA}
      variables={{ ids: paperIds.slice(0, maxQueriedPapers) }}
    >
      {({ loading, error, data }) => {
        if (loading) return <h2>Loading papers...</h2>;
        if (error) throw error;
        if (!data.papers) return null;

        const sortedPapers = data.papers.sort(sortCitationsDesc);

        // sort by descending citations
        return (
          <Fragment>
            <div>
              <Row>
                <div>{`Showing ${showPapers} of ${p} papers -> `}</div>
              </Row>
              <Row>
                {sortedPapers.length ? (
                  <MediumButton onClick={onFilterReset}>
                    Reset Filters
                  </MediumButton>
                ) : null}
                <Link
                  to={{
                    pathname: urls.search.results,
                    state: {
                      papers: sortedPapers,
                    },
                  }}
                >
                  <MediumButton>Explore Cluster</MediumButton>
                </Link>
              </Row>
              <TopTopics papers={data.papers} />
            </div>
            <div
              css={(props) => css`
                pointer-events: none;
              `}
            >
              {sortedPapers.slice(0, showPapers).map((p) => (
                <PaperReducedDetail key={`paper-title-${p.title}`} data={p} />
              ))}
            </div>
          </Fragment>
        );
      }}
    </Query>
  );
};

const TopTopics = ({ papers, maxTopics = 10 }) => {
  const topTopics = papers.reduce((histogram, paper) => {
    for (let topic of paper.topics) {
      let {
        topic: { name },
      } = topic;

      if (histogram.get(name)) {
        histogram.set(name, histogram.get(name) + 1);
      } else {
        histogram.set(name, 1);
      }
    }
    return histogram;
  }, new Map());

  // yield sorted values
  topTopics[Symbol.iterator] = function* () {
    yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
  };

  return (
    <div>
      <WordCloud histogram={[...topTopics]} />
    </div>
  );
};

const WordCloud = ({ histogram, numEntries = 10 }) => {
  const data = histogram.slice(0, numEntries);
  const size = scaleLog()
    .domain(extent(data, (d) => d[1]))
    .range([14, 32]);

  return (
    <Flex
      css={(props) => css`
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: baseline;
        pointer-events: none;
        margin: ${props.spacing.large} 0;
      `}
    >
      {data.map(([topic, count], i) => {
        return (
          <div
            key={`top-topics-${i}-${count}`}
            style={{ fontSize: `${size(count)}px` }}
          >
            {topic}
          </div>
        );
      })}
    </Flex>
  );
};

export default Summary;
