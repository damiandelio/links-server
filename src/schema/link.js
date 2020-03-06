import { gql } from "apollo-server-express";
import { GraphQLScalarType } from "graphql";

const uriType = new GraphQLScalarType({
  name: "Uri",
  description: "Has to be a valid URI",
  serialize(value) {
    let result;
    // Implement your own behavior here by setting the 'result' variable
    return result;
  },
  parseValue(value) {
    let result;
    // Implement your own behavior here by setting the 'result' variable
    return result;
  },
  parseLiteral(ast) {
    switch (
      ast.kind
      // Implement your own behavior here by returning what suits your needs
      // depending on ast.kind
    ) {
    }
  }
});

export const typeDef = gql`
  scalar Uri

  type Link {
    uri: String!
    videoResources: [String]!
  }
`;

export const resolvers = {
  Uri: uriType
};
