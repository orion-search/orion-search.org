/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import { PageLayout } from "../../components/shared/layout";
import CollaborationNetworks from "../../layouts/CollaborationNetworks";
import { useOrionData } from "../../OrionData.context";
import { Query } from "@apollo/react-components";
import { gql } from "apollo-boost";

const METADATA = gql`
  query metadata {
    geocoded_places(distinct_on: [country]) {
      lat
      lng
      country
    }
  }
`;

const Networks = () => {
  const data = useOrionData().networks;
  return (
    <PageLayout
      css={css`
        padding-bottom: 0;
      `}
    >
      <Query query={METADATA}>
        {({ loading, error, data: _ }) => {
          if (loading) return null;
          if (error) return `Error! ${error}`;

          console.log(_.geocoded_places);

          return (
            <CollaborationNetworks data={data} metadata={_.geocoded_places} />
          );
        }}
      </Query>
    </PageLayout>
  );
};

export default Networks;
