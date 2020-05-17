/** @jsx jsx */

import { Fragment } from "react";
import { css, jsx } from "@emotion/core";
import { Query } from "@apollo/react-components";
import { scaleLog, extent } from "d3";

import { formatThousands, sortCitationsDesc, urls } from "../../utils";
import { PAPER_METADATA } from "../../queries";

import { Flex } from "../../components/shared/layout";
import { LinkButton } from "../../components/shared/button";
import { PaperReducedDetail } from "../../components/shared/paper";

const Summary = ({ paperIds, showPapers = 5 }) => {
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
        if (loading) return null;
        if (error) throw error;
        if (!data.papers) return null;

        const sortedPapers = data.papers.sort(sortCitationsDesc);

        // sort by descending citations
        return (
          <Fragment>
            <div>
              {`Showing ${showPapers} of ${p} papers -> `}
              <TopTopics papers={data.papers} />
              <LinkButton
                to={{
                  pathname: urls.search.results,
                  state: {
                    papers: sortedPapers,
                  },
                }}
              >
                EXPLORE CLUSTER
              </LinkButton>
            </div>
            <div
              css={css`
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
  console.log(data);

  console.log(data.map(([key, val]) => [key, size(val)]));

  return (
    <Flex
      css={css`
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: baseline;
        pointer-events: none;
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
