const gql = require("graphql-tag");

// The typeDefs for type checking the models we want to create
module.exports = gql`
  type Post {
    id: ID!
    title: String!
    body: String!
    createdAt: String!
    username: String!
  }
  type Query {
    getPosts: [Post]
  }
`;
