var bcrypt=require('bcrypt');
const { default: mongoose } = require('mongoose');
var manager=require("../models/managermodel")



module.exports={
    managersignup:async(userdata)=>{
        console.log(userdata);
      
        const hashedpass = await bcrypt.hash(userdata.password, 10);
      
        var newmanager = new manager({
          firstname: userdata.firstname,
          lastname: userdata.lastname,
          topic:userdata.topic,
          email: userdata.email,
          password: hashedpass,
          verified:false
        });
      
        try {
          var response = await newmanager.save();
          console.log("signed up");
          return response;
        } catch (error) {
            console.log("signup error"+error);
          return false;
        }

    },
    managerlogin:(userdata)=>{
        console.log(userdata); 

      return new Promise((resolve, reject) => {
        var response={}
        manager.findOne({email:userdata.email }, (err, user) => {
            if (err) {
              console.log(err);
              
              resolve(err) 
            }
            if (!user) {
              response.staus=false
              response.message="user not found"
              resolve (response)
            } else {
              if (!user.verified) {
                response.status=false
                response.message="not verified"
                resolve (response)
              } else {
                bcrypt.compare(userdata.password, user.Password, (error, result) => {
                  if (error) {
                    response.status=false
                    response.message="error"
                    resolve (error)
                  }
                  if (!result) {
                    response.status=false
                    response.message="wrong password"
                    resolve (response)
                  }
                  response.status=true
                  resolve (response)
                });
              }
            }
         });
         
       })
    



    },
     updateManager :async (id) => {
        try {
          var man= await manager.findById(mongoose.Types.ObjectId(id));
          if (!man) {
            return false;
          }
        
          await manager.findOneAndUpdate({_id:mongoose.Types.ObjectId(id)},{$set:{verified:true}})
          return true;
        } catch (err) {
          console.error(err);
          return false;
        }
      },
      allmanagers:async()=>{
        try {
            var response=await manager.find({}).exec()
            return response
        } catch (error) {
            return error
        }
      }
}