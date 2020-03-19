import { gql } from "apollo-server-express";
import { hash, compare } from "bcryptjs";

import { User } from "../models/user";
import { createAccessToken } from "../utils/auth";
import { encryptStr } from "../utils/encryption";

export const typeDef = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Auth {
    accessToken: String!
  }

  enum SortFindManyUserInput {
    NAME_ASD
    NAME_DESC
    EMAIL_ASD
    EMAIL_DESC
  }

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

  extend type Mutation {
    """
    Crea un usuario nuevo. Verifica que no haya un usuario ya registrado con ese email.
    """
    createUser(name: String!, email: String!, password: String!): Auth!

    login(email: String!, password: String!): Auth!
  }
`;

export const resolvers = {
  Query: {
    userById: async (_, { id }) => {
      // buscar en la base de datos
      const user = await User.findById(id);
      return user;
    },

    /////////////////////////////////////////////////////////////////////////

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
    createUser: async (_, { name, email, password }) => {
      // hash password
      const hashedPassword = await hash(password, 12);

      // instancia un nuevo usuario del esquema User
      let user = new User({
        name,
        email: email.toLowerCase(),
        password: hashedPassword
      });

      try {
        // intenta crear el usuario en la DB
        user = await user.save();
      } catch (err) {
        // segun el codigo de error retorna informacion al cliente
        switch (err.code) {
          case 11000:
            throw new Error("This email is already in use.");

          default:
            throw new Error("Error al crear el usuario.");
        }
      }

      // crea un token
      const token = createAccessToken(user);

      // new user created successfullyl: returns an encrypted token
      return {
        accessToken: encryptStr(token)
      };
    },

    /////////////////////////////////////////////////////////////////////////

    login: async (_, { email, password }) => {
      // chequea que no haya campos vacíos
      if (email === "" || password === "") {
        throw new Error("Empty fields, email or password");
      }

      // search the user in the db
      const user = await User.findOne({
        email: email.toLowerCase()
      });

      // Si no se encuentra el usuario en la db lanza una exepcion
      if (!user) throw new Error("Could not find user");

      // compara la contraseña de la peticion con la encriptada proveniente de la db
      const valid = await compare(password, user.password);
      // si la contraseña no es valida lanza una exepcion
      if (!valid) throw new Error("Bad password");

      // crea un token
      const token = createAccessToken(user); // user is the user id

      // login successful: returns an encrypted token
      return {
        accessToken: encryptStr(token)
      };
    }
  }
};
