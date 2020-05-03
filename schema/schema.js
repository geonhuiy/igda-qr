const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLBoolean,
} = require("graphql");

const bcrypt = require("bcrypt");
const saltRound = 12;

const member = require("../models/memberModel");

const memberType = new GraphQLObjectType({
  name: "member",
  fields: () => ({
    id: { type: GraphQLID },
    firstname: { type: GraphQLString },
    lastname: { type: GraphQLString },
    email: { type: GraphQLString },
    organization: {type: GraphQLString}
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    members: {
      type: new GraphQLList(memberType),
      description: "Get all members",
      resolve(parent, args) {
        return member.find();
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
  }),
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
