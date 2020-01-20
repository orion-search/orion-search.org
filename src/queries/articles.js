import { gql } from "apollo-boost";

export const ARTICLE_BY_TITLE = gql`
  query {
    
  }
`;

export const ARTICLE_VECTORS = gql`
  query articleVectors {
    doc_vectors(limit: 10) {
      vector
      doi
      id
      mag_paper {
        citations
        date
        bibtex_doc_type
        title
        year
        publisher
        mag_paper_authors {
          mag_author {
            name
          }
        }
      }
    }
  }
`;
