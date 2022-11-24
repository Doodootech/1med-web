//Imports

const express = require('express');
const passport = require("passport");
const bcrypt = require('bcrypt');
const { pool } = require('../dbConfig');
const initializePassport = require("../passportConfig");
const router = express.Router();


initializePassport(passport);

//get views for login and signup
router.get('/patient-login', checkAuthenticated, (req, res) => {
    res.render('auth/patient-login');
});

router.get('/providers-login',  (req, res) => {
    res.render('auth/provider-login');
});


router.get('/patient-signup', (req, res) => {
    res.render('auth/patient-signup')
});

router.get('/provider-signup', (req, res) => {
    res.render('auth/provider-signup')
});

router.get('/forgot-password', (req, res) => {
  res.render('auth/forgot-password')
});


//post for signup and login

//patient signup
router.post("/patient-signup", async (req, res) => {
    let { phone, email, firstName, lastName, dob, password, password2 } = req.body;

    let errors=[];

    if (!phone || !email || !firstName || !lastName || !dob || !password || !password2){
      errors.push({ message: "Please enter all fields"});
    }

    if (password.length < 6){
      errors.push({ message: "Password is too weak"});
    }

    if (password != password2) {
      errors.push({ message: "Passwords do not match"});
    }

    if (errors.length > 0) {
      res.render("auth/patient-signup", {errors})
    }else{

      //form validation passed
      let hashedPassword = await bcrypt.hash(password, 10);
        

      pool.query(
        `SELECT * FROM patients
         WHERE email = $1`, [email], (err, results) => {
          if (err) {
            throw err;
          }
          //console.log(results.rows);
          
          
          if (results.rows.length > 0){
            errors.push({ message: "email already exist"})
            res.render("auth/patient-signup", {errors});

          }else{
           
      pool.query(
              `INSERT INTO patients (phone, email, firstName, lastName, dob, password)
              VALUES ($1, $2, $3, $4, $5, $6)
              RETURNING id, password`, [phone, email, firstName, lastName, dob, hashedPassword], 
              (err, results) => {
                if (err){
                  throw err
                }
                req.flash('success_msg', "Registration successful");
                res.redirect('../dashboard/patient');
              }
            );
          }
         }
      );
        }
   
  });

  //provider  signup
router.post("/provider-signup", async (req, res) => {
  let { phone, email, firstName, lastName, dob, password, password2 } = req.body;

  let errors=[];

  if (!title ||  !phone || !email || !firstName || !lastName || !dob || !password || !password2){
    errors.push({ message: "Please enter all fields"});
  }

  if (password.length < 6){
    errors.push({ message: "Password is too weak"});
  }

  if (password != password2) {
    errors.push({ message: "Passwords do not match"});
  }

  if (errors.length > 0) {
    res.render("auth/provider-signup-signup", {errors})
  }else{

    //form validation passed
    let hashedPassword = await bcrypt.hash(password, 10);
      

    pool.query(
      `SELECT * FROM providers
       WHERE email = $1`, [email], (err, results) => {
        if (err) {
          throw err;
        }
        //console.log(results.rows);
        
        
        if (results.rows.length > 0){
          errors.push({ message: "email already exist"})
          res.render("auth/provider-signup", {errors});

        }else{
         
    pool.query(
            `INSERT INTO providers (phone, email, firstName, lastName, dob, password)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, password`, [phone, email, firstName, lastName, dob, hashedPassword], 
            (err, results) => {
              if (err){
                throw err
              }
              req.flash('success_msg', "Registration successful");
              res.redirect('../dashboard/provider');
            }
          );
        }
       }
    );
      }
 
});

  // login route
  router.post("/patient-login",  
    passport.authenticate('local',{
    successRedirect: "/dashboard/patient",
    failureRedirect: "./patient-login",
    failureFlash: true
    }),
    (req, res, next) => {
      res.redirect("/dashboardpatient")
    });
     


function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("./dashboard/patient");
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/patient-login");
}


  router.get('auth/patient-logout',   (req, res) => {
    req.logout();
    res.render("/", { message: "You have logged out successfully" });
  });

module.exports = router