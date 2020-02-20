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
      topic: field_of_study_id
    }
  }
`;

export const DIVERSITY_BY_TOPIC = gql`
  query diversityByTopic($topic: Int!) {
    view_diversity_by_country(
      where: { field_of_study_id: { _eq: $topic }, year: { _eq: "2019" } }
    ) {
      country
      diversity: shannon_diversity
      year
      female_share
      topic: field_of_study_id
    }
  }
`;
