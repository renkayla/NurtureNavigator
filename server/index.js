require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

// Connect to MongoDB
mongoose.connect('mongodb+srv://renkayla:mCqEH6HL3szly1n0@cluster0.mongodb.net/NurtureNavigator?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

const app = express();

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// use an immediately-invoked function expression (IIFE) to use async/await at the top level
(async function startApolloServer() {
    await server.start();
  
    server.applyMiddleware({ app });
  
    app.listen({ port: 4000 }, () =>
      console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    );
  })();
