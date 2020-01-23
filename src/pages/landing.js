import React from "react";

import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
// import AddAuthor from "../components/AddAuthor";
// import AuthorList from "../components/AuthorList";

const GET_ARTICLES = gql`
  query ArticleAuthors {
    article_authors(limit: 10, offset: 10) {
      article_data {
        title
        abstract
      }
      author_data {
        name
        institution
        id
      }
    }
  }
`;

const Landing = () => {
  const { loading, error, data } = useQuery(GET_ARTICLES);
  if (loading) return "loading...";
  if (error) return `error: ${error.message}`;

  console.log(data);

  return (
    <div>
      <h1>Explore by author / institute / country</h1>
      <h1>Search by paper</h1>
    </div>
  );
};

export default Landing;
