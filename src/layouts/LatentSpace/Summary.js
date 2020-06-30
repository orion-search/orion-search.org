/** @jsx jsx */

import { Fragment } from "react";
import { css, jsx } from "@emotion/core";
import { Query } from "@apollo/react-components";
import { Link } from "react-router-dom";

import { formatThousands, sortCitationsDesc, urls } from "../../utils";
import { PAPER_METADATA } from "../../queries";

import { Row } from "../../components/shared/layout";
import { MediumButton, SmallButton } from "../../components/shared/button";
import { PaperReducedDetail } from "../../components/shared/paper";
import { WordCloud } from "../../components/visualizations";

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
              <Row
                css={css`
                  align-items: center;
                  width: max-content;
                  // flex-direction: row;
                `}
              >
                {/* <div> */}
                <div
                  css={css`
                    padding-right: 10px;
                  `}
                >{`Showing ${showPapers} of ${p} papers -> `}</div>
                <Link
                  to={{
                    pathname: urls.search.results,
                    state: {
                      papers: sortedPapers,
                    },
                  }}
                >
                  <SmallButton>Explore Cluster</SmallButton>
                </Link>
                {/* </div> */}
              </Row>
              <Row>
                {sortedPapers.length ? (
                  <MediumButton nofill onClick={onFilterReset}>
                    Reset Filters
                  </MediumButton>
                ) : null}
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

export default Summary;
