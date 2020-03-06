import { typeDef as User, resolvers as userResolvers } from "./user";
import {
  typeDef as Bookmark,
  resolvers as bookmarkResolvers
} from "./bookmark";
import { typeDef as Link, resolvers as linkResolvers } from "./link";

import { gql } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";

const typeDef = gql`
  type Query {
    _: String
  }

  type Mutation {
    _: String
  }

  type Response {
    error: Boolean!
    info: String
  }
`;

const resolvers = {};

export default makeExecutableSchema({
  typeDefs: [typeDef, User, Bookmark, Link],
  resolvers: [resolvers, userResolvers, bookmarkResolvers, linkResolvers]
});
