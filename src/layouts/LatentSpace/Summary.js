import React, { Fragment } from "react";
import { Query } from "@apollo/react-components";

import {
  formatThousands,
  sortCitationsDesc,
  urls,
  accessors,
} from "../../utils";
import { PAPER_METADATA } from "../../queries";

import { LinkButton } from "../../components/shared/button";
import { PaperReducedDetail } from "../Search/Paper";

const Summary = ({ paperIds, showPapers = 5 }) => {
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
              <LinkButton
                to={{
                  pathname: urls.search,
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

export default Summary;
