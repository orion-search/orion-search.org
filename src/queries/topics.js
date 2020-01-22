import { gql } from "apollo-boost";

export const TOPIC_HIERARCHY = gql`
  {
    hierarchy: mag_field_of_study_hierarchy(distinct_on: [id]) {
      topic: id
      parent: parent_id
      child: child_id
    }
    topics: mag_fields_of_study(distinct_on: [id]) {
      topic: id
      name
    }
  }
`;
