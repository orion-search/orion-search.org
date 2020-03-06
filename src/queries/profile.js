import { gql } from "apollo-boost";

export const COUNTRY_OUTPUT_TOPIC = gql`
  query outputByCountry($country: String!) {
    view_country_output_topic(
      where: { country: { _eq: $country }, total_citations: { _gte: 50 } }
    ) {
      topic_name: name
      date: month
      total_papers: count
      total_citations
    }
  }
`;

export const OUTPUT_TOPIC_COUNTRY = gql`
  query outputByTopicCountry($country: String!, $year: String!) {
    output_topic_country(
      where: { country: { _eq: $country }, year: { _eq: $year } }
      order_by: { total_papers: desc }
    ) {
      country
      year
      topic: name
      total_citations
      total_papers
    }
  }
`;
