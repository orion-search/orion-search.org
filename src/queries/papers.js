import { gql } from "apollo-boost";

export const PAPER_METADATA = gql`
  query papersById($ids: [bigint!]) {
    papers: mag_papers(where: { id: { _in: $ids } }) {
      id
      title
      original_title
      source
      date
      citations
      authors: mag_paper_authors {
        author: mag_author {
          name
        }
      }
      publisher
      year
      topics: mag_paper_fields_of_studies {
        topic: mag_fields_of_study {
          name
        }
      }
    }
  }
`;
