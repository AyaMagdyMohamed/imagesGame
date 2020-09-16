var express=require("express");

const fileUpload = require('express-fileupload');

var HomeRoutes=require("./routes/home");
var imageRoutes=require("./routes/imageWaterMark");

var app=express();

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

app.use(express.static("public"))
app.use(express.json())
app.use("/",HomeRoutes);
app.use("/create",imageRoutes);

app.listen(8090, function() {

    console.log("connected");
});
