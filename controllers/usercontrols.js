
var bcrypt=require('bcrypt');

const {article,comment,rating} = require('../models/articlemodel');

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

  

    
    verifyuser:(req,res,next)=>{
      if (req.session.userloggedin) {
  

          next()
          
        } else {
          res.redirect('/login')
        }
      },



      savearticle:async(data,author,userid)=>{

        var {topic,title,content}=data
      
        var newarticle=new article({
          author,topic,title,content,userid,
          approved:false,

        })

         var response= await newarticle.save()

        return response
    

        

      },
      myarticles:async(auth)=>{

        var response= await article.find({author:auth}).exec()
        
        return response
      },
      deletearticle:async(id)=>{
       var repose=await  article.findByIdAndDelete(id)
        console.log(repose);
        return true
      },
      findarticle:async(id)=>{

        var articles=await article.findById(id).exec()
        console.log(articles);
        return articles
      },
      approvedarticles:async()=>{
        var articles=await article.find({approved:true}).exec()
       
        return articles
      },
savecomment:(username,com,articleid)=>{
const newcomment = new comment({
  commentedby:username,
  text:com,
});

// Find an article and add the comment and rating
article.findOne({_id:articleid}, (err, article) => {
  if (err) {
    console.error(err);
    return;
  }

  article.comments.push(newcomment);
 

  article.save((err) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log('Article saved with comment.');
  });
});


      },

ratingsave: async (username, userrating, articleid) => {
        console.log(username)
        console.log(userrating);
      
        try {
          const articles = await article.findById(articleid);
          const existingRating = articles.ratings.find(rating => rating.user === username);
      
          if (existingRating) {
            // update the existing rating
            existingRating.value = userrating;
          } else {
            // add a new rating
            const newRating = new rating({
              user: username,
              value: userrating,
            });
            articles.ratings.push(newRating);
          }
      
          await articles.save();
      
          console.log('Article saved with rating.');
          return article.averageRating;
        } catch (err) {
          console.error(err);
          throw err;
        }
      }
      ,

 averageUserRating: async (userId) => {
 try {
      const articles = await article.find({ userid: userId });
      const sum = articles.reduce((total, obj) => total + obj.averageRating, 0);
      const avg = sum / articles.length;
      console.log(avg);
      return avg;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  editarticle:(id,updates)=>{

  try {
    article.findOneAndUpdate({ _id: id }, { $set: {updates} });
  } catch (error) {
    console.log(error);
    
  }

  }
  
}
