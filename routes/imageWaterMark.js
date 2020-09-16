var express=require("express");

var multer=require("multer");
const sharp = require('sharp');
var uploadedfileMiddleware=multer({dest:"./public"});
var router=express.Router();

  

router.post("/",function(req,resp){

    if(!req.files) {
        resp.status(400);
        resp.send({ "error": { "message": 'No files uploaded!' } });
    }

    if(!req.body["imageDetails"]) {
        resp.status(400);
        resp.send({ "error": { "message": 'Enter image details' } });
    }
    try {

    let imageDetails = JSON.parse(req.body.imageDetails);
   
    let template = req.files.template;
    let image = req.files.image;
    template.mv('./public/' + template.name);
    image.mv('./public/' + image.name);
  //resp.send(req.body.test);
  /*
  {
  "template": "File", 
  "image": "File", 
  "imageDetails": {
    "startPoint": ["x","y"],
    "width": "Number",
    "height": "Number",
    "angel": "Number"
  }
}
   */
  
  sharp('./public/'+image)
  .rotate(imageDetails.angel)
  .resize(imageDetails.width,imageDetails.height)
  .toBuffer({ resolveWithObject: true })
  .then(({ data, info }) => {
    sharp('./public/'+ template) // Let's start a new sharp on the underside image 
    
    .composite([{ 
      input: data,
      top:imageDetails.startPoint[1],
      left:imageDetails.startPoint[0],
      blend:"dest-over"

       // Pass in the buffer data to the composite function
    }])
    .toFile('./public/output.jpg', function(err,info) {
      console.log("Error: ", err);
      resp.send(info);
    });
  }) 

    }catch(err){
        console.log(err)
        resp.send("something wrong happend , our engineers are working on it");
    }
  
  
});
  

/*sharp('./public/'+req.body.image)
  .rotate(req.body.imageDetails.angel)
  .resize(req.body.imageDetails.width,req.body.imageDetails.height)
  .then(({ data, info }) => { 
    sharp('./public/'+'start.png')
    .composite([{ 
      input: data 
    }])
    .toFile('output.jpg', function(err) {
      console.log("Error: ", err)
    });
  console.log(info);
  })*/



module.exports=router;
