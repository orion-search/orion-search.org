import { gql } from "apollo-boost";

export const DIVERSITY_BY_COUNTRY = gql`
  query diversityByCountry($country: String!, $year: String!) {
    view_diversity_by_country(
      where: { country: { _eq: $country }, year: { _eq: $year } }
    ) {
      country
      diversity: shannon_diversity
      year
      female_share
    }
  }
`;

export const DIVERSITY_BY_TOPIC = gql`
  query diversityByTopic($topic: String!, $year: String!) {
    view_diversity_by_country(
      where: { topic: { _eq: $topic }, year: { _eq: $year } }
    ) {
      country
      diversity: shannon_diversity
      year
      female_share
      topic
    }
  }
`;
