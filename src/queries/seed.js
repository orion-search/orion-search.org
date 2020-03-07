import { gql } from "apollo-boost";

export const SEED_DATA = gql`
  query seedData {
    byCountry: viz_paper_country {
      country
      count
      ids: paper_ids
    }
    byTopic: viz_paper_topics {
      field_of_study_id
      name
      count
      ids: paper_ids
    }
    byYear: viz_paper_year {
      year
      count
      ids: paper_ids
    }
    diversity: viz_metrics_by_country {
      year
      country
      diversity: shannon_diversity
      rca_sum
      female_share
      topic: name
    }
    topics: viz_paper_topics {
      topic: name
    }
    vectors: doc_vectors {
      vector_3d
      id
    }
  }
`;
