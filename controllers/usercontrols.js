
var bcrypt=require('bcrypt');
const { response } = require('express');
const articlemodel = require('../models/articlemodel');

const usermodels = require('../models/usermodels');





module.exports={


    usersignup: async (userdata) => {
        console.log(userdata);
      
        const hashedpass = await bcrypt.hash(userdata.password, 10);
      
        var newuser = new usermodels({
          firstname: userdata.firstname,
          lastname: userdata.lastname,
          email: userdata.email,
          password: hashedpass
        });
      
        try {
          var response = await newuser.save();
          console.log("signed up");
          return response;
        } catch (error) {
          return error;
        }
     } ,

userlogin:async(userdata)=>{
try {

    var user= await usermodels.findOne({"email":userdata.email}).exec()
    if (user){
        console.log(user);
        var password=userdata.password
        var hash=user.password
        var  status=bcrypt.compare(password,hash)

       if (status){
        console.log("logged in");
       
       return user
       }else 
       {
        console.log("wrong pass");

        return false
       }
    }else{
        console.log("user doesnt exist");

        return false
    }    
} catch (error) {
    console.log(error)
    throw error;
}


    },

    addarticle:async(req,res)=>{
        var data=req.body
         
        var newarticle = new articlemodel({
            topic: data.topic,
            article: data.article,
           
           
          })
         response= await newarticle.save().exec()
         console.log(response);


    }
}