var express=require("express");

var multer=require("multer");
var uploadedfileMiddleware=multer({dest:"./public"});
var router=express.Router();

  
router.get("/",function(req,res){

    res.send("hello");

})

router.post("/",uploadedfileMiddleware.single("cv"),function(req,resp){
  resp.send(req.file.filename)

})

module.exports=router;
