var express = require('express');
const { verifyAdmin, addtopic, viewtopics } = require('../controllers/admincontrol');
const { updateManager, allmanagers } = require('../controllers/managercontrol');
const { verifyadminlogin } = require('../middleware/adminhelp');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {   
  res.render('admin/adminlogin',{admin:true})
});
router.post('/adminlogin',(req,res)=>{
 verifyAdmin(req.body).then((response)=>{
    
    
    if(response.status){
      req.session.admin=response.admin
      req.session.adminloggedin=true;
      res.render('admin/adminpage',{admin:true})
    }else{
      res.render('admin/adminlogin',{message:"invalid",admin:true})
    }
  })
})
router.get("/topics",verifyadminlogin,async(req,res)=>{

 var response =await viewtopics()
  res.render('admin/topics',({admin:true,response}))
})
router.post('/topics-add',(req,res)=>{
  addtopic(req.body)
  res.redirect("/admin/topics")
})
router.get('/adminlogout', (req, res) => {
  req.session.admin=null
  req.session.adminloggedin=false
  res.redirect('/admin')

})
router.get("/managers",async(req,res)=>{
var managers=  await allmanagers()

  res.render('admin/managers',{admin:true,managers})
})

router.post("/updateManager",async(req,res)=>{
var resp= await updateManager(req.body)

     res.json(resp)

})



module.exports = router;
  