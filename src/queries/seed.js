import { gql } from "apollo-boost";

import { accessors } from "../utils";

export const SEED_DATA = gql`
  query seedData {
    byCountry: viz_paper_country {
      ${accessors.names.country}
      count
      ${accessors.names.ids}: paper_ids
    }
    byTopic: viz_paper_topics {
      field_of_study_id
      ${accessors.names.topic}: name
      count
      ${accessors.names.ids}: paper_ids
    }
    byYear: viz_paper_year {
      ${accessors.names.year}
      count
      ${accessors.names.ids}: paper_ids
    }
    diversity: viz_metrics_by_country {
      year
      ${accessors.names.country}
      ${accessors.names.diversity}: shannon_diversity
      ${accessors.names.rca}: rca_sum
      ${accessors.names.femaleShare}: female_share
      ${accessors.names.topic}: name
    }
    topics: viz_paper_topics {
      ${accessors.names.topic}: name
    }
    vectors: doc_vectors {
      ${accessors.names.vector3d}: vector_3d
      ${accessors.names.id}
    }
  }
`;
