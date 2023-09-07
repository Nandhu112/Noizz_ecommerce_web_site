const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  
  Category: {
    type: String,
    required: true,
    unique:true        
  },
  Listed:{
   type:Boolean,
   default:true
 }
  

  // Add more properties as needed
});
             
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
