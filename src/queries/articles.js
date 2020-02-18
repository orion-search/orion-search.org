import { gql } from "apollo-boost";

export const PAPER_CITATIONS = gql`
  query filterPapersByCitations($citations: Int!) {
    papers: mag_papers(where: { citations: { _gte: $citations } }) {
      id
    }
  }
`;

export const ARTICLE_VECTORS = gql`
  {
    vectors: doc_vectors {
      vector_3d
      vector_2d
      doi
      id
      paper: mag_paper {
        citations
      }
    }
  }
`;
