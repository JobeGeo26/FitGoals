var express = require("express");

var router = express.Router();


var restricted = ["heartrate", "stepcount", "profile", "nutrition", "activities", "goals"];

//Restrict pages
router.get("*", function(req, res, next) {
    var args = req.url.split("/");
    var pageName = args[args.length-1];

    var token = req.cookies.token;

    if (restricted.includes(pageName) && (!token || token == "NULL" || token == "")) {
        res.redirect("/index");
        return;
    }

    next();
});

router.get("/", function(req,res){
    res.render("index");
});

router.get('/index', function(req, res, next) {
    res.render('index');
});

router.get("/about", function(req,res){
    res.render("about");
});

router.get("/home", function(req,res){

    const accessToken =req.query.access_token;
    console.log("Access token:"+ accessToken);

    res.render("home",{title:"FitGoals Home",layout: "appLayout.hbs"});

});

router.get("/heartrate", function(req,res){
    res.render("heartrate",{title:"FitGoals Heart rate",layout: "appLayout.hbs"});
});

router.get("/stepcount", function(req,res){
    res.render("stepcount",{ title:"FitGoals Step count",layout: "appLayout.hbs"});
});

router.get("/goals", function(req,res){
    res.render("goals",{ title:"FitGoals Goals",layout: "appLayout.hbs"});
});

router.get("/activities", function(req,res){
    res.render("activities",{title:"FitGoals Activities",layout: "appLayout.hbs"});
});

router.get("/nutrition", function(req,res){
    res.render("nutrition",{ title:"FitGoals Nutrition",layout: "appLayout.hbs"});
});

router.get("/profile", function(req,res){
    res.render("profile",{title:"FitGoals Profile",layout: "appLayout.hbs"});
});



module.exports = router;
