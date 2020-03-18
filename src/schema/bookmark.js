import { gql } from "apollo-server-express";

import { Bookmark } from "../models/bookmark";
import { Link } from "../models/link";
import { User } from "../models/user";

export const typeDef = gql`
  extend type Query {
    bookmarkById(id: ID!): Bookmark
    bookmarkSelectMany(page: Int, limit: Int): [Bookmark]!
  }

  extend type Mutation {
    createBookmark(
      uri: Uri!
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
    owner: User!
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
      { uri, title = "", description = "", tags = [] },
      context
    ) => {
      // check if the user is logged in
      if (!context.user) throw new Error("You need to be logged");

      const link = new Link({
        uri,
        videoResources: []
      });

      let bookmark = new Bookmark({
        link,
        title,
        description,
        tags,
        owner: context.user
      });

      try {
        // save new link in db
        await link.save();

        // save new bookmark in db
        bookmark = await bookmark.save();

        // update the user and save the bookmark in his bookmark`s array
        await User.updateOne(
          { _id: context.user },
          { $push: { bookmarks: bookmark._id } }
        );
      } catch (err) {
        // if an error occurred saving to the database
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
