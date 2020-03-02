var express = require("express");

var router = express.Router();
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/fitgoals.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    else{
    console.log('Connected to the fitgoals database.');
    }
  });
  
  db.run('CREATE TABLE IF NOT EXISTS users(user_id TEXT PRIMARY KEY, nutrition_val1 TEXT NOT NULL, nutrition_amount1 TEXT NOT NULL, nutrition_val2 TEXT NOT NULL, nutrition_amount2 TEXT NOT NULL);',function(err){
    if (err) {
        return console.log(err.message);
      }
      else{
          console.log("table created IF NOT EXISTING");
      }
  });

 
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

router.get("/getNutritionGoals/:id", function(req, res){
    let id =req.params.id;
    let sql = `SELECT *
           FROM users
           WHERE user_id  = ?`;
    
           db.get(sql, [id], (err, row) => {
            if (err) {
             console.error(err.message);
            }
            else{ return row
              ? res.json({user_id: row.user_id, nutrition_val1: row.nutrition_val1, nutrition_amount1: row.nutrition_amount1, nutrition_val2: row.nutrition_val2, nutrition_amount2: row.nutrition_amount2})
              : console.log(`No user found with the id ${id}`);
            }
           
          });
    
});

router.post("/updateNutrition", function(req, res){
    console.log(req.body);
    let body = req.body;
    let data = [body.nutrition_val1, body.nutrition_amount1, body.nutrition_val2, body.nutrition_amount2, body.user_id];
let sql = `UPDATE users
            SET nutrition_val1 = ?,
            nutrition_amount1 = ?,
            nutrition_val2 = ?,
            nutrition_amount2 = ?
            WHERE user_id = ?`;

            db.run(sql, data, function(err) {
                if (err) {
                  return console.error(err.message);
                }
                else{
                console.log(`Row(s) updated: ${this.changes}`);
                res.json({status: "nutrition goals updated!"});
                }
               
              });

});

  router.post("/addUser", function(req, res){
 async function addUser(){   
    let data = req.body;
    console.log(data)
    console.log("userID"+data.user_id);
    let isNew = await checkUser(data.user_id);
    console.log(isNew);
    if(isNew === false){
        db.run(`INSERT INTO users VALUES(?, ?, ?, ?, ?)`, [data.user_id,data.nutrition_val1,data.nutrition_amount1,data.nutrition_val2,data.nutrition_amount2], function(err) {
            if (err) {
              return console.log(err.message);
            }
            // get the last insert id
            else{
            console.log(`A row has been inserted with rowid ${this.lastID}`);
            res.json({status: "new user added"});
            }
          });
           
    }
    else{
        res.json({status: "user exists"});
    }
}
addUser();

});

function checkUser(userId){
    var value = false;
    let sql = `SELECT DISTINCT user_id user FROM users
           ORDER BY user`;
           return new Promise(function(resolve, reject) {
            db.all(sql, [], (err, rows) => {
                if (err) {
                    throw err;
                }
                else {
                    rows.forEach((row) => {
                       
                        if(userId === row.user){
                           
                            value = true;
                        }
                    });
                }
                
                resolve(value);
            });
        });
}


module.exports = router;
