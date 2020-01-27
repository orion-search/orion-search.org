import { gql } from "apollo-boost";

export const COUNTRY_OUTPUT_TOPIC = gql`
  query outputByCountry($country: String!) {
    view_country_output_topic(
      where: { country: { _eq: $country }, total_citations: { _gte: 50 } }
    ) {
      topic_name: name
      month
      total_papers: count
      total_citations
    }
  }
`;
