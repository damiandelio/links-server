import { gql } from "apollo-server-express";

import { Bookmark } from "../models/bookmark";
import { Link } from "../models/link";

export const typeDef = gql`
  extend type Query {
    bookmarkById(id: ID!): Bookmark
    bookmarkSelectMany(page: Int, limit: Int): [Bookmark]!
  }

  extend type Mutation {
    createBookmark(
      uri: String!
      title: String
      description: String
      tags: [String]
    ): Response!

    updateBookmark(
      id: ID!
      title: String
      description: String
      tags: [String]
    ): Response!

    delateBookmark(id: ID!): Response!
  }

  type Bookmark {
    id: ID!
    link: Link!
    title: String!
    description: String
    tags: [String]!
    # by: User!
  }
`;

export const resolvers = {
  Query: {
    bookmarkSelectMany: async (_, { page = 1, limit = 20 }) => {
      return;
    }
  },
  Mutation: {
    createBookmark: async (
      _,
      { uri, title = "", description = "", tags = [] }
    ) => {
      const link = new Link({
        uri,
        videoResources: []
      });

      const bookmark = new Bookmark({
        link,
        title,
        description,
        tags
        //by,
      });

      try {
        // it save new link in db
        await link.save();
        // it save new bookmark in db
        await bookmark.save();
      } catch (err) {
        // if an error occurs saving in db
        return {
          error: true,
          info: "Error creating bookmark."
        };
      }

      return {
        error: false,
        info: "Bookmark created."
      };
    }
  }
};
