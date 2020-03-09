import { gql } from "apollo-server-express";

export const typeDef = gql`
  type Link {
    uri: Uri!
    videoResources: [String]!
  }
`;

export const resolvers = {};
