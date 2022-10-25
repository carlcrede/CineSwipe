const { gql } = require('apollo-server-express');
const Credentials = require('./db/model/credentials');
// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    credentials: [Credentials]
  }

  type Credentials {
    email: String
    username: String
    password: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    credentials: () => Credentials.find(),
  },
};

module.exports = {
    typeDefs, resolvers
}