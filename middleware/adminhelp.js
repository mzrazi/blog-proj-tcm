var express=require("express")


module.exports={

    verifyadminlogin:(req,res,next)=>{
        if(req.session.adminloggedin){
            next()
        }else{
            res.redirect("/admin")
        }
    }

}