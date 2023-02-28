const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true})

const userSchema = {
  email: String,
  phone: String,
  password: String
};

const User = new mongoose.model("User",userSchema);

app.get("/", (req,res) =>{
  res.render("home");
})

app.get("/login", (req,res) =>{
  res.render("login");
})

app.get("/register", (req,res) =>{
  res.render("register");
})

app.get("/logout",(req,res) =>{
  res.render("home");
})


app.post("/register", (req,res) =>{
  const newUser = new User ({
    email: req.body.username,
    password: req.body.password,
    phone: req.body.phone
  })
  const password = newUser.password;

  function validatePassword(password) {
  if (password.length < 12) {
    return false;
  }
  if (!/[A-Z]/.test(password)) {
    return false;
  }
  if (!/[a-z]/.test(password)) {
    return false;
  }
  if (!/[0-9]/.test(password)) {
    return false;
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return false;
  }
  return true;
}

  if(validatePassword(password)){
    console.log("Password is valid!");
    newUser.save().then(() =>{
      res.render("action");
    }).catch((err) =>{
      console.log(err);
    })
  }else{
    console.log("Password is invalid!");
  }

})

app.post("/login",(req,res) =>{
  const phone = req.body.phone;
  const password = req.body.password;
  User.findOne({phone:phone})
    .then((foundUser) => {
        if(foundUser){
            if(foundUser.password === password){
                res.render("action");
            }
        }
   })
   .catch((error) => {
       console.log(err);
       res.send(400, "Bad Request");
   });

})

app.post("/logout",(req,res) =>{
  res.render("home")
})

app.listen(3000, () =>{
  console.log("Server is running on port 3000");
})
