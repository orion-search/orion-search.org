import { gql } from "apollo-boost";

// export const ARTICLE_BY_TITLE = gql`
//   query {

//   }
// `;

export const ARTICLE_VECTORS = gql`
  {
    vectors: doc_vectors {
      vector
      doi
      id
      paper: mag_paper {
        citations
        date
        bibtex_doc_type
        title
        year
        publisher
        authors: mag_paper_authors {
          mag_author {
            name
          }
        }
      }
    }
  }
`;
