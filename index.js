"use strict";
require("dotenv").config();
const express = require("express");
const graphql = require("express-graphql");

const app = express();
app.use("/graphql", (req, res) => {
  graphql({
    //schema: graphqlschema,
    graphiql: true,
    context: { req, res },
  });
});
app.listen(process.env.HTTP_PORT);
