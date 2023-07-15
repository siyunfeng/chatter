const mongoose = require('mongoose');
require('dotenv').config();

const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const uri = `mongodb+srv://${dbUsername}:${dbPassword}@chatter.b2y7cbf.mongodb.net/?retryWrites=true&w=majority`;

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose
      .connect(uri)
      .then(() => {
        console.log('database connection successful');
      })
      .catch((error) => console.log(`database connection error: ${error}`));
  }
}

module.exports = new Database();
