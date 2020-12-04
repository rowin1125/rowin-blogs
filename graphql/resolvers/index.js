const postsResolvers = require("./posts");
const userResolvers = require("./users");

// Here we combine all the resolvers of difference resource we have in our application
module.exports = {
  // Modifiers for Resource
  // Each time a mutation or query is activated, it will also run this first
  Query: {
    ...postsResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postsResolvers.Mutation,
  },
};
