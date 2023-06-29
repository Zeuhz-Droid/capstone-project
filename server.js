const mongoose = require('mongoose');

require('dotenv').config();

const DB = process.env.DATABASE_URL;

// this connects to database
function connectToDatabase() {
  mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(`connection to database successful.`);
    })
    .catch((err) => {
      console.log('connection failed - Dey play!');
    });
}

module.exports = connectToDatabase;
