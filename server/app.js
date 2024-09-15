if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const {
  typeDefs: userType,
  resolvers: userResolvers,
} = require("./schemas/User");
const {
  typeDefs: followType,
  resolvers: followResolvers,
} = require("./schemas/Follow");

const {
  typeDefs: postsType,
  resolvers: postsResolvers,
} = require("./schemas/Posts");

// const { verifyToken } = require("./helpers/jwt");
const authentication = require("./middlewares/authentication");


const server = new ApolloServer({
  typeDefs: [userType, followType, postsType],
  resolvers: [userResolvers, followResolvers, postsResolvers],
  instrospection: true,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
async function startServer() {
  try {
   

    const { url } = await startStandaloneServer(server, {
      listen: { port: 80 },
      context: async ({ req }) => {
        return {
          auth: () => authentication(req),
        };
      },
    });
    console.log(`Jalan Boss ${url}`);
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}
startServer();
