import ApolloClient from "apollo-boost";
import fetch from "isomorphic-fetch";

console.log(process.env);

export const client = new ApolloClient({
  uri: process.env.GATSBY_HASURA_GRAPHQL_URL,
  fetch
});
