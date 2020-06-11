import { storiesOf } from "@storybook/react";
import { setupGraphiQL } from "@storybook/addon-graphql";

import { SEED_DATA, PAPER_METADATA } from "../queries";

const graphiql = setupGraphiQL({
  url: process.env.REACT_APP_HASURA_GRAPHQL_URL,
});

storiesOf("Addons|GraphQL", module).add(
  `Seed Data`,
  graphiql(SEED_DATA.loc.source.body)
);

storiesOf("Addons|GraphQL", module).add(
  `Paper Metadata`,
  graphiql(
    PAPER_METADATA.loc.source.body,
    `{
    "ids": [1821593932]
  }`
  )
);
