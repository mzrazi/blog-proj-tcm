
var express = require('express');
const { viewtopics } = require('../controllers/admincontrol');
const { verifymanager, allarticles, managersignup, managerlogin, approvearticle, rejectarticle } = require('../controllers/managercontrol');
var router = express.Router();

router.get("/" ,(req,res)=>{

  req.session.user=null
  req.session.adminloggedin=false
  req.session.userloggedin=false

    res.render("manager/managerlogin")
    })
router.get("/approve",verifymanager,async(req,res)=>{

        var articles=await allarticles()
      
        
        res.render("manager/approve",{articles})
      
      })
router.get("/approve-article/:id",(req,res)=>{
 approvearticle(req.params.id)
  res.redirect("/manager/approve")
})
router.get("/reject-article/:id",(req,res)=>{
rejectarticle(req.params.id)
 res.redirect("/manager/approve")
    })

    
router.post("/managerlogin", async(req, res) => {
  managerlogin(req.body).then((resp) => {
    if (resp.status) {
      req.session.user = resp;
      req.session.managerloggedin = true;
      res.redirect('/manager/approve');
    } else {
      res.render("manager/managerlogin", { message: resp.message });
    }
  });
})
router.get("/managersignup" ,async(req,res)=>{
    var topics=await viewtopics()
    res.render("manager/managersignup",{topics})
    })
  router.post("/managersignup" ,async(req,res)=>{
      var response=await managersignup(req.body)
      if(response){
        res.render("manager/managerlogin",{message:"you can login when admin approves"})
      }else{
        res.redirect('/manager/managersignup',{message:"signup failed"})
      }
    })

    router.get('/managerlogout', (req, res) => {
        req.session.user=null
        req.session.managerloggedin=false
        res.redirect('/manager')
      
      })
      

module.exports = router;

