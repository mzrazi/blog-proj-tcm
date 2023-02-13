const topic= require("../models/topicmodel")




module.exports={
    verifyAdmin:(data)=>{

        let response={}
                return new Promise((resolve, reject) => {
                    if(data.username=='admin'){
                        if(data.password=='12345'){
                            response.admin="admin"
                            response.status=true
                            resolve(response)
                        }else{
                            resolve({status:false})
                            console.log('wrong pass');
                        }
                    }else{
                        resolve({status:false})
                        console.log('wrong username');
        
                    }
                })
              
            },
        addtopic:async(data)=>{

            var newtopic= new topic({
                topic:data.topic,
                description:data.description
            })
            try {
               var response=await newtopic.save()
               return response
            } catch (error) {
                return error
            }
           

        },
        viewtopics:async()=>{
            try {
                var response= await topic.find({}).exec()
                return response
            } catch (error) {
                return error
            }
        }
}