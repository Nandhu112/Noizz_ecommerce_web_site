const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Category: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  Description: {                  
    type: [String], // Array of strings
    default: [], // Default value as an empty array
  },
  // Image: {
  //   data: Buffer,
  //   contentType: {
  //     type: String,
  //     default: 'image/jpeg',
  //   },
  Images: [{
    data: Buffer,
    contentType: {
      type: String,
      default: 'image/jpeg',
    }
  }],
  Stock: {
    type: Number,
    default: 0, // Default stock value is 0
  },
  Deleted:{
    type:Boolean,
    default:false
  },
  
  

  // Add more properties as needed
});

const Product = mongoose.model('Product', productSchema);                       

module.exports = Product;
