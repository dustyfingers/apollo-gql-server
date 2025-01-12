import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const users = [
  { is: "1", name: "John Doe", age: 30, isMarried: true },
  { is: "2", name: "Jane Doe", age: 25, isMarried: true },
  { is: "3", name: "Simon Jones", age: 30, isMarried: false },
  { is: "4", name: "Kate Adams", age: 22, isMarried: true },
];

// these types define our entire api
const typeDefs = `
    type Query {
        getUsers: [User]
        getUserById(id: ID!): User
    }

    type Mutation {
        createUser(name: String!, age: Int!, isMarried: Boolean!): User!
    }

    type User {
        id: ID
        name: String
        age: Int
        isMarried: Boolean
    }
`;

// functions that help tell our api how to deal with our defs
const resolvers = {
  Query: {
    getUsers: () => users,
    getUserById: (parent, args) => users.find((user) => user.id === args.id),
  },
  Mutation: {
    createUser: (parents, args) => {
      const { name, age, isMarried } = args;
      const newUser = {
        id: (users.length + 1).toString(),
        name,
        age,
        isMarried,
      };
      users.push(newUser);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log("server running at url: ", url);
