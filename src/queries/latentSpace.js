import { gql } from "apollo-boost";

export const FILTER_PAPERS = gql`
  query latentSpace($countries: [String!], $topics: [String]) {
    papers: latent_space(where: { country: { _in: $countries } }) {
      country
      topic
      paper_id
      vector_3d
    }
  }
`;

export const VECTOR_BY_ID = gql`
  query vectorById($ids: [ID!]) {
    papers: doc_vectors(where: { id: { _in: $ids } }) {
      id
      vector_3d
    }
  }
`;
