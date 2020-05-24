import ApolloClient from "apollo-boost";
import { InMemoryCache } from "apollo-cache-inmemory";
import fetch from "isomorphic-fetch";

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  // defaultOptions: {
  //   watchQuery: {
  //     fetchPolicy: "cache-and-network"
  //   }
  // },
  fetch,
  uri: process.env.REACT_APP_HASURA_GRAPHQL_URL,
});
