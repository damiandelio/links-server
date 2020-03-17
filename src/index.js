import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";

import "./utils/db";
import schema from "./schema";
import getUser from "./utils/getUser";

dotenv.config();

const app = express();

// configure HTTP headers
app.use(helmet());
app.use(helmet.referrerPolicy({ policy: "same-origin" }));
/*
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'"]
    }
  })
);
*/

const server = new ApolloServer({
  schema,
  cors: true,
  playground: process.env.NODE_ENV === "development" ? true : false,
  introspection: true,
  tracing: true,
  path: "/",
  context: ({ req, res }) => {
    // get the user encrypted token from the headers.
    const encryptedToken = req.headers.authorization || "";

    // retrieve user id
    const user = getUser(encryptedToken);

    // return context whit the user id
    return { req, res, user };
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
  console.log(`😷 Health checks available at ${process.env.HEALTH_ENDPOINT}`);
});
