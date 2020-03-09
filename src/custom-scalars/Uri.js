import isValidURI from "../utils/isValidURI";

import { GraphQLScalarType } from "graphql";

const serializeURI = value => {
  if (isValidURI(value)) {
    return value;
  }
  throw new Error("Url cannot represent an invalid URL string");
};

const parseValueURI = value => {
  if (isValidURI(value)) {
    return value;
  }
  throw new Error("Url cannot represent an invalid URL string");
};

const parseLiteralURI = ast => {
  if (isValidURI(ast.value)) {
    return ast.value;
  }
  throw new Error("Url cannot represent an invalid URL string");
};

// define un nuevo custom scalar type
const Uri = new GraphQLScalarType({
  name: "Uri",
  description: "A valid URI string",
  serialize: serializeURI,
  parseValue: parseValueURI,
  parseLiteral: parseLiteralURI
});

export const typeDef = `
  scalar Uri
`;

export const resolvers = {
  Uri
};
