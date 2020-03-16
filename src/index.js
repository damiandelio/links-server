import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { verify } from "jsonwebtoken";
import { ApolloServer } from "apollo-server-express";

import mongoose from "mongoose";

import "./utils/db";
import schema from "./schema";

dotenv.config();

const app = express();

app.use(helmet()); // ayuda a proteger de algunas vulnerabilidades web conocidas mediante el establecimiento correcto de cabeceras HTTP

const server = new ApolloServer({
  schema,
  cors: true,
  playground: process.env.NODE_ENV === "development" ? true : false,
  introspection: true,
  tracing: true,
  path: "/",
  context: ({ req }) => {
    let user;
    // get the user token from the headers.
    const token = req.headers.authorization || "";
    // secret word
    const key = process.env.TOKEN_KEY || "";

    // if a token is defined in the header
    if (token) {
      // try to retrieve a user id with the token
      user = verify(token, key).user;
    }

    // add the user to the context
    return { user };
  }
});

server.applyMiddleware({
  app,
  path: "/",
  cors: true,
  onHealthCheck: () =>
    new Promise((resolve, reject) => {
      if (mongoose.connection.readyState > 0) {
        resolve();
      } else {
        reject();
      }
    })
});

app.listen({ port: process.env.PORT || 4000 }, () => {
  console.log(`🚀 Server listening on port ${process.env.PORT || 4000}`);
  // console.log(`😷 Health checks available at ${process.env.HEALTH_ENDPOINT}`);
});
