const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// Step 3: Define a GraphQL Schema
const schema = buildSchema(`
  type Item {
    id: ID!
    title: String!
    author: String!
    status: String!
  }

  type Query {
    getItem(id: ID!): Item
    getItems: [Item]
  }

  type Mutation {
    addItem(title: String!, author: String!, status: String!): Item
    updateItem(id: ID!, title: String, author: String, status:String!): Item
    deleteItem(id: ID!): Item
  }
`);

// Step 4: Create a sample data array
let items = [
  { id: "1", title: "To Kill a Mockingbird", author: "Harper Lee",status:"Yet To Return" },
  { id: "2", title: "1984", author: "George Orwell",status:"Returned" },
  { id: "3", title: "Pride and Prejudice", author: "Jane Austen",status:"Returned" },
  { id: "4", title: "The Great Gatsby", author: "F. Scott Fitzgerald",status:"Yet To Return" },
  { id: "5", title: "Moby Dick", author: "Herman Melville",status:"Returned" }
];

// Step 5: Define resolvers for the schema
const root = {
  getItem: ({ id }) => items.find(item => item.id === id),
  getItems: () => items,
  addItem: ({ title, author,status }) => {
    const newItem = { id: String(items.length + 1), title, author,status };
    items.push(newItem);
    return newItem;
  },
  updateItem: ({ id, title, author,status }) => {
    const item = items.find(item => item.id === id);
    if (item) {
      if (title) item.title = title;
      if (author) item.author = author;
      if (status) item.status = status;
    }
    return item;
  },
  deleteItem: ({ id }) => {
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      return items.splice(index, 1)[0];
    }
    return null;
  }
};

// Step 6: Set up the GraphQL endpoint
const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, // Enables the GraphiQL interface
}));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/graphql`);
});