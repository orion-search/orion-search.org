import { gql } from "apollo-boost";

export const SEED_PAPER_COUNTRY = gql`
  query papersByCountry {
    paper_country {
      country
      count
      paper_ids: ids
    }
  }
`;

export const SEED_PAPER_TOPICS = gql`
  query papersByTopic($frequency: Int) {
    paper_topics(where: { frequency: { _gte: $frequency } }) {
      id
      name
      level
      frequency
      paper_ids
    }
  }
`;
