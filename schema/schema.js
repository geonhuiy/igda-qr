const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLBoolean,
} = require("graphql");

const {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime,
} = require("graphql-iso-date");

const bcrypt = require("bcrypt");
const saltRound = 12;

const member = require("../models/memberModel");
const event = require("../models/eventModel");

const memberType = new GraphQLObjectType({
  name: "member",
  fields: () => ({
    id: { type: GraphQLID },
    firstname: { type: GraphQLString },
    lastname: { type: GraphQLString },
    email: { type: GraphQLString },
    organization: { type: GraphQLString },
  }),
});

const eventType = new GraphQLObjectType({
  name: "event",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    date: { type: GraphQLDateTime },
    location: { type: GraphQLString },
    attendees: {
      type: new GraphQLList(memberType),
      resolve(parent, args) {
        return member.find({ _id: { $in: parent.attendees } });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    allMembers: {
      type: new GraphQLList(memberType),
      description: "Get all members",
      resolve(parent, args) {
        return member.find();
      },
    },
    memberById: {
      type: memberType,
      description: "Gets a member by id",
      args: {
        id: { type: GraphQLID },
      },
      resolve: async (parent, args) => {
        return await member.findById(args.id);
      },
    },
    allEvents: {
      type: new GraphQLList(eventType),
      description: "Get all events",
      resolve(parent, args) {
        return event.find();
      },
    },
    event: {
      type: eventType,
      description: "Get an event by id",
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return event.findById(args.id);
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "MutationType",
  fields: () => ({
    registerMember: {
      type: memberType,
      description: "Register member",
      args: {
        firstname: { type: new GraphQLNonNull(GraphQLString) },
        lastname: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        organization: { type: GraphQLString },
      },
      resolve: async (parent, args, { req, res }) => {
        try {
          const hash = await bcrypt.hash(args.password, saltRound);
          const hashedMember = {
            ...args,
            password: hash,
          };
          const newMember = new member(hashedMember);
          const result = await newMember.save();
        } catch (err) {
          throw new Error(err);
        }
      },
    },
    addEvent: {
      type: eventType,
      description: "Add new event",
      args: {
        location: { type: new GraphQLNonNull(GraphQLString) },
        date: { type: new GraphQLNonNull(GraphQLDateTime) },
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args, { req, res }) => {
        try {
          let checkExistingEvent = await event.findOne({ name: args.name });
          if (!checkExistingEvent) {
            let newEvent = new event(args);
            return newEvent.save();
          }
        } catch (err) {
          throw new Error(err);
        }
      },
    },
    attendeeCheckIn: {
      type: eventType,
      description: "Check attendees into the event",
      args: {
        attendeeId: { type: GraphQLID },
        eventId: { type: GraphQLID },
      },
      resolve: async (parent, args, { req, res }) => {
        try {
          let attendingMember = await (
            await member.findById(args.attendeeId)
          ).toObject();
          //delete attendingMember.password;
          return await event.findByIdAndUpdate(
            args.eventId,
            { $addToSet: { attendees: attendingMember._id } },
            { new: true }
          );
        } catch (err) {
          throw new Error(err);
        }
      },
    },
  }),
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
