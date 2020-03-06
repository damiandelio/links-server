import { gql } from "apollo-server-express";

import { User } from "../models/user";

export const typeDef = gql`
  extend type Query {
    """
    Busca un ususario por id.
    """
    userById(id: ID!): User
    """
    Pagination.
    """
    userSelectMany(
      filter: String
      """
      Page number of items to display. It works as an offset.
      """
      page: Int
      """
      Max limit of items per page.
      """
      limit: Int
      """
      Order of the elements.
      """
      sort: SortFindManyUserInput
    ): [User]!
  }

  enum SortFindManyUserInput {
    NAME_ASD
    NAME_DESC
    EMAIL_ASD
    EMAIL_DESC
  }

  type User {
    id: ID!
    name: String!
    email: String!
  }

  extend type Mutation {
    """
    Crea un usuario nuevo. Verifica que no haya un usuario ya registrado con ese email.
    """
    createUser(name: String!, email: String!): Response!
  }
`;

export const resolvers = {
  Query: {
    userById: async (_, { id }) => {
      // buscar en la base de datos
      const user = await User.findById(id);
      return user;
    },

    userSelectMany: async (_, { filter, page = 1, limit = 20, sort }) => {
      const MIN_NUM_ITEMS = 1,
        MAX_NUM_ITEMS = 50;
      let fieldName, sortOrder;

      // valida el limite minimo y maximo de elementos devueltos por pagina
      limit < MIN_NUM_ITEMS ? (limit = MIN_NUM_ITEMS) : limit;
      limit > MAX_NUM_ITEMS ? (limit = MAX_NUM_ITEMS) : limit;

      // calcula el offset de los usuarios a partir del cual se va a devolver, basado en el numero de pagina
      const pageNumber = page * limit - limit;

      if (sort !== undefined) {
        // evalua si sort es ascendente o descendiente
        sort.search(/_ASD/i) !== -1
          ? (sortOrder = 1) // ascendente
          : (sortOrder = -1); // descendiente

        // rescata a que campo hace referencia sort
        const strEnd = sort.search("_");
        fieldName = sort.substr(0, strEnd).toLowerCase();
      }

      // buscar en la base de datos
      const users = await User.find({})
        .limit(limit)
        .skip(pageNumber)
        .sort({ [fieldName]: sortOrder });

      return [...users];
    }
  },
  Mutation: {
    createUser: async (_, { name, email }) => {
      // instancia un nuevo usuario del esquema User
      const user = new User({
        name,
        email
      });

      try {
        // intenta crear el usuario en la DB
        await user.save();
      } catch (err) {
        // segun el codigo de error retorna informacion al cliente
        switch (err.code) {
          case 11000:
            return {
              error: true,
              info: "This email is already in use."
            };
            break;

          default:
            return {
              error: true,
              info: `Undefined error. Code: ${err.code}`
            };
        }
      }

      return {
        error: false,
        info: "New user created successfully."
      };
    }
  }
};
