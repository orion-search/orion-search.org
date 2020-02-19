import { gql } from "apollo-boost";

export const DIVERSITY_BY_COUNTRY = gql`
  query diversityByCountry($country: String!) {
    view_diversity_by_country(
      where: { country: { _eq: $country }, year: { _eq: "2019" } }
    ) {
      country
      diversity: shannon_diversity
      year
      female_share
      topic: field_of_study_id
    }
  }
`;

// export const DIVERSITY_BY_TOPIC = gql``;
