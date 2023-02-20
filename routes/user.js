var express = require('express');
const { viewtopics } = require('../controllers/admincontrol');

const { usersignup, userlogin, verifyuser, savearticle, myarticles, deletearticle, findarticle, approvedarticles, ratingsave, savecomment, averageUserRating, editarticle} = require('../controllers/usercontrols');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.session.user=null
  req.session.adminloggedin=false
  req.session.managerloggedin=false
  res.render('user/index',{user:req.session.user});
});

router.get('/signup',(req,res)=>{

  res.render('user/signup')

})
router.post('/signup',(req,res)=>{
  
 var response=usersignup(req.body)
if(response){
  console.log(response);
  req.session.user=response
  res.render('user/index',{user:req.session.user})
}else{
  res.render('/signup',{ "error": true })
}
})
router.get('/login',(req,res)=>{

 
  if (req.session.user) {
    try {
      
      res.render('/',{user:req.session.user});
     } catch (err) {
      console.error(err);
      res.render('error', { "error": err });
    }
  } else {
    try {
      res.render('user/login', { "loginErr": req.session.userLoginErr });
      req.session.userLoginErr = false;
    } catch (err) {
      console.error(err);
      res.render('error', { "error": err });
    }
  }

 
  
})


router.post('/login',async(req,res)=>{

  var user= await userlogin(req.body)
 
  if(user){
    req.session.user=user
    req.session.userloggedin=true
   

    res.render('user/index',{user:req.session.user})

  }else{
    req.session.loginErr=true
    res.render('user/login',{"loginerr":req.session.loginErr})
    req.session.loginErr = false;
  }

})
router.get('/logout', (req, res) => {
  req.session.user=null
  req.session.userloggedin=false
  res.redirect('/login')

})
router.get('/myblogs',verifyuser,async(req,res)=>{
  var firstname=req.session.user.firstname
  var lastname=req.session.user.lastname
  
  var fullname= firstname+ "" +lastname

 var articles=await myarticles(fullname)
 
  res.render('user/myblogs',{articles})
})





router.get("/add-article", verifyuser, async(req,res)=>{

      var topics=await viewtopics()
      res.render("user/add-article",{topics})

    })

router.post("/add-article",verifyuser,async(req,res)=>{
      var firstname=req.session.user.firstname
      var lastname=req.session.user.lastname
      var id=req.session.user._id
      var fullname= firstname+ "" +lastname
     
       await savearticle(req.body,fullname,id)

      res.redirect("/add-article")
    })
router.get("/delete/:id",(req,res)=>{
  deletearticle(req.params.id)
  res.redirect("/myblogs")
})

router.get("/edit/:id",async(req,res)=>{
 var article=await findarticle(req.params.id)
 var topics=await viewtopics()
  res.render("user/edit",{article,topics})
})


router.get("/articles",verifyuser,async(req,res)=>{
  const avgRating = await averageUserRating(req.session.user._id);
  if (avgRating > 4.0) {
    req.session.userpremium = true;
  } else {
    req.session.userpremium = false;
  }
  var articles= await approvedarticles()
  res.render("user/articles",{articles})
})
router.post("/rate-article/:id",verifyuser,(req,res)=>{
  
  var username=req.session.user.firstname+req.session.user.lastname
  
  var rating=req.body.rating
 var id=req.params.id
  ratingsave(username,rating,id)
  res.redirect('/articles')
})
router.post('/save-comment/:id',(req,res)=>{
  var username=req.session.user.firstname+req.session.user.lastname
  
  var comment=req.body.comment
 var id=req.params.id
 savecomment(username,comment,id)
res.redirect('/articles')
})

router.post("edit-article/:id",(req,res)=>{
  editarticle(req.params.id,req.body)
  res.redirect('/manager/approve')
})




module.exports = router;
