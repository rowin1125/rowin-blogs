require("dotenv").config();
const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("-> 📡 MongoDB connected ");
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`-> 🚀 Server running at ${res.url}`);
  })
  .catch((err) => console.error(err));
