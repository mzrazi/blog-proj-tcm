const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var managerSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        index:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    topic:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    verified:{
        type:Boolean,
        required:true
    },
});

//Export the model
module.exports = mongoose.model('manager', managerSchema);