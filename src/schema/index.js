import { typeDef as User, resolvers as userResolvers } from "./user";
import { typeDef as Link, resolvers as linkResolvers } from "./link";
import {
  typeDef as Bookmark,
  resolvers as bookmarkResolvers
} from "./bookmark";
import {
  typeDef as Uri, // data type
  resolvers as uriResolvers
} from "../custom-scalars/Uri";

import { gql } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";

const typeDef = gql`
  type Query {
    _: String
  }

  type Mutation {
    _: String
  }
`;

const resolvers = {};

export default makeExecutableSchema({
  typeDefs: [typeDef, User, Bookmark, Link, Uri],
  resolvers: [
    resolvers,
    userResolvers,
    bookmarkResolvers,
    linkResolvers,
    uriResolvers
  ]
});
