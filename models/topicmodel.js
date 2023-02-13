const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var topicSchema = new mongoose.Schema({
    topic:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    description:{
        type:String,
        required:true,
       
    },
   
});

//Export the model
module.exports = mongoose.model('topic', topicSchema);