const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
require('dotenv').config();

// Create Express app
const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));


// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the Apollo Server
async function startApolloServer() {
  await server.start();
}
startApolloServer().then(() => {
  // Apply Apollo middleware to Express app
  server.applyMiddleware({ app });


    const port = process.env.PORT || 4000;
     app.listen(port, () => {
      console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
    });
});
