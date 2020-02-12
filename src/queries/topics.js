// Fields of study-related queries — used in constructing topic hierarchy

import { gql } from "apollo-boost";

export const FIELDS_OF_STUDY = gql`
  query fieldsOfStudy {
    hierarchy: view_child_parent_field_of_study(
      distinct_on: [name]
      where: { level: { _eq: 1 } }
    ) {
      name
      level
      parent: parent_name
    }
  }
`;

export const FIELDS_OF_STUDY_BY_PARENT = gql`
  query fieldOfStudyByParent($id: Int!) {
    topics: mag_field_of_study_hierarchy(where: { id: { _eq: $id } }) {
      id
      children: child_id
    }
  }
`;

export const OUTPUT_PER_COUNTRY = gql`
  query outputPerCountry($country: String!) {
    output: view_country_output_topic_top100(
      where: { country: { _eq: $country } }
    ) {
      country
      total_papers
      total_citations
      topic
      name
    }
    hierarchy: view_child_parent_field_of_study(
      distinct_on: [name]
      where: { level: { _eq: 1 } }
    ) {
      name
      level
      parent: parent_name
    }
  }
`;
