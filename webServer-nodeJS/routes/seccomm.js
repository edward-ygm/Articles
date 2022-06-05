'user strict'
var express=require('express');
var router=express.Router();

router.use('/',function(req,res,next){
	res.send("hello seccomm");
});

module.exports = router;