"use strict";
require("dotenv").config();
const express = require("express");
const graphql = require("express-graphql");
const graphqlschema = require('./schema/schema');

const app = express();
const db = require("./db/db");

app.use(express.json()); //parsing application/json
app.use(express.urlencoded({ extended: true })); //parsing application/form-urlencoded
//app.use("/modules", express.static("node_modules"));

const memberRoute = require("./routes/memberRoute");
app.use("/member", memberRoute);

app.use("/graphql", (req, res) => {
  graphql({
    schema: graphqlschema,
    graphiql: true,
    context: { req, res },
  })(req,res);
});


app.get("/", function (req, res) {
  res.send("Base route");
});

db.on("connected", () => {
  app.listen(process.env.HTTP_PORT, () => {
    console.log("Listening on port " + process.env.HTTP_PORT);
  });
});
