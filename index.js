"use strict";
require("dotenv").config();
const express = require("express");
const graphql = require("express-graphql");

const app = express();
const db = require("./db/db");
/*app.use("/graphql", (req, res) => {
  graphql({
    //schema: graphqlschema,
    graphiql: true,
    context: { req, res },
  });
});*/
app.get("/", function (req, res) {
  res.send("Init route");
});
db.on("connected", () => {
  app.listen(process.env.HTTP_PORT, () => {
    console.log("Listening on port " + process.env.HTTP_PORT);
  });
});
