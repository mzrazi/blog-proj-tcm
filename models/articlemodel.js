const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var articleSchema = new mongoose.Schema({
    topic:{
        type:String,
        required:true,    
    },
    article:{
        type:String,
        required:true,
        
    },
   
})

//Export the model
module.exports = mongoose.model('articl', articleSchema);