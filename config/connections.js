const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const{MONGO_URL}=process.env

const connectDB = () => {
  return mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log("MongoDB connected");
    })     
    .catch((err) => {
      console.log("MongoDB connection error:", err);
    });
};

module.exports = connectDB;
