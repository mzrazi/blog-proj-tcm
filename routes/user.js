var express = require('express');
const { viewtopics } = require('../controllers/admincontrol');
const { managersignup, managerlogin } = require('../controllers/managercontrol');
const { usersignup, userlogin } = require('../controllers/usercontrols');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
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
  console.log(user);
  if(user){
    req.session.user=user

    res.render('user/index',{user:req.session.user})

  }else{
    req.session.loginErr=true
    res.render('user/login',{"loginerr":req.session.loginErr})
    req.session.loginErr = false;
  }

})
router.get('/logout', (req, res) => {
  req.session.user=null
  res.redirect('/login')

})
router.get('/myblogs',(req,res)=>{
  res.render('user/myblogs')
})
router.get('/addarticle',(req,res)=>{



})

router.get("/managerlogin" ,(req,res)=>{

res.render("manager/managerlogin")
})
router.post("/managerlogin",async(req,res)=>{


   managerlogin(req.body).then((resp)=>{
  if(resp.status){
    res.render('manager/approve')
  }else{
    res.render("manager/managerlogin" ,{message:resp.message})
  }
})
router.get("/managersignup" ,async(req,res)=>{
  var topics=await viewtopics()
  res.render("manager/managersignup",{topics})
  })

  router.post("/managersignup" ,async(req,res)=>{
  var response=await managersignup(req.body)
  if(response){
    res.render('manager/managerlogin',{message:"you can login when admin approves"})
  }else{
    res.redirect('/managersignup',{message:"signup failed"})
  }
})
    })




module.exports = router;
