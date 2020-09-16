const express = require("express");
const sharp = require('sharp');
const router = express.Router();



router.post("/", async function (req, resp) {

  if (!req.files) {
    resp.status(400);
    resp.send({ "error": { "message": 'No files uploaded!' } });
  }

  if (!req.body["imageDetails"]) {
    resp.status(400);
    resp.send({ "error": { "message": 'Enter image details' } });
  }
  try {

    let imageDetails = JSON.parse(req.body.imageDetails);

    let template = req.files.template;
    let image = req.files.image;
    await template.mv('./public/' + template.name);
    await image.mv('./public/' + image.name);
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

    sharp('./public/' + image)
      .rotate(imageDetails.angel)
      .resize(imageDetails.width, imageDetails.height)
      .toBuffer({ resolveWithObject: true })
      .then(({ data, info }) => {
        sharp('./public/' + template) // Let's start a new sharp on the underside image 

          .composite([{
            input: data,
            top: imageDetails.startPoint[1],
            left: imageDetails.startPoint[0],
            blend: "dest-over"

            // Pass in the buffer data to the composite function
          }])
          .toFile('./public/output.jpg', function (err, info) {
            console.log("Error: ", err);
            resp.send({ "finalTemplateURL": req.host + "output.jpg" });
          });
      })

  } catch (err) {
    console.log(err)
    resp.send("something wrong happend , our engineers are working on it");
  }


});


module.exports = router;
