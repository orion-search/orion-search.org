module.exports = {
  plugins: [
    {
      resolve: "gatsby-source-graphql",
      options: {
        typeName: "HASURA",
        fieldName: "hasura",
        url: process.env.GATSBY_HASURA_GRAPHQL_URL,
        refetchInterval: 10 // Refresh every 60 seconds for new data
      }
    },
    `gatsby-plugin-emotion`
    // {
    //   resolve: `gatsby-plugin-typescript`,
    //   options: {
    //     isTSX: true, // defaults to false
    //     jsxPragma: `jsx`, // defaults to "React"
    //     allExtensions: true // defaults to false
    //   }
    // }
  ]
};
