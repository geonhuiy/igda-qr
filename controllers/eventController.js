const schema = require("../schema/schema");
var { graphql } = require("graphql");

const getAllEvents = async (req, res) => {
  let query = "{allEvents{id,name,date,location,attendees{firstname,lastname}}}";
  graphql(schema, query).then((result) => {
    res.send(result);
  });
};

const getEventById = async (req, res) => {
  let query = `{event(id:"${req.params.id}"){id,name,date,location}}`
  graphql(schema, query).then((result) => {
    res.send(result);
  })
};

module.exports = {
  getAllEvents,
  getEventById,
};