import React, { Fragment } from "react";
import { Query } from "@apollo/react-components";

import { formatThousands, sortCitationsDesc, urls } from "../../utils";
import { PAPER_METADATA } from "../../queries";

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
            {sortedPapers.slice(0, showPapers).map((p) => (
              <PaperReducedDetail key={`paper-title-${p.title}`} data={p} />
            ))}
          </Fragment>
        );
      }}
    </Query>
  );
};

const TopTopics = ({ papers }) => {
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
      {[...topTopics].map(([topic, count], i) => {
        if (i > 10) return null;
        return (
          <div key={`top-topics-${i}-${count}`}>
            <div>{topic}</div>
            <div>{count}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Summary;
