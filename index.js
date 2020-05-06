"use strict";
require("dotenv").config();
const express = require("express");
const graphql = require("express-graphql");
const graphqlschema = require("./schema/schema");
const cors = require("cors");
const helmet = require("helmet");
const https = require("https");
const http = require("http");
const fs = require("fs");

const sslKey = fs.readFileSync('ssl-key.pem');
const sslCert = fs.readFileSync('ssl-cert.pem');

const options = {
  key: sslKey,
  cert: sslCert
}

const app = express();
const db = require("./db/db");
app.use(cors());
app.use(helmet());
app.enable('trust proxy');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

const memberRoute = require("./routes/memberRoute");
const eventRoute = require("./routes/eventRoute");
app.use("/member", memberRoute);
app.use("/event", eventRoute);

app.use("/graphql", (req, res) => {
  graphql({
    schema: graphqlschema,
    graphiql: true,
    context: { req, res },
  })(req, res);
});

db.on("connected", () => {
  app.listen(process.env.HTTP_PORT);
});
