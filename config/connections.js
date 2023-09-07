const mongoose = require('mongoose');

const connectDB = () => {
  return mongoose.connect('mongodb://127.0.0.1:27017/noizz_user', {
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
