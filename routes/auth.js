//Imports

const express = require('express');

const User = require('../models/User');

const bcrypt = require('bcrypt');
const { pool } = require('../dbConfig');

const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

const router = express.Router();



//get views for login and signup
router.get('/patient-login', (req, res) => {
    res.render('auth/patient-login');
});

router.get('/providers-login', (req, res) => {
    res.render('auth/provider-login');
});


router.get('/patient-signup', (req, res) => {
    res.render('auth/patient-signup')
});

router.get('/providers-signup', (req, res) => {
    res.render('auth/provider-signup')
});



//post for signup and login
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
      res.render("/patient-signup", {errors})
    }else{

      //form validation passed
      let hashedPassword = await bcrypt.hash(password, 10);
        

      pool.query(
        `SELECT * FROM patients
         WHERE email = $1`, [email], (err, results) => {
          if (err) {
            console.log(err);
          }
          console.log(results.rows);
          
          
          if (results.rows.length > 0){
            errors.push({ message: " email already exist"})
            res.render("/patient-signup", {errors});

          }else{
           
      pool.query(
              `INSERT INTO patients (phone, email, firstName, lastName, dob, password)
              VALUES ($1, $2, $3, $4, $5, $6)
              RETURD id, password`, [phone, email, firstName, lastName, dob, hashedPassword], 
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

  // login route
  router.post("/patient-login", async (req, res) => {
    const body = req.body;
    const user = await User.findOne({ email: body.email });
    if (user) {
      // check user password with hashed password stored in the database
      const validPassword = await bcrypt.compare(body.password, user.password);
      if (validPassword) {
        res.redirect('../dashboard/patient');
      } else {
        res.status(400).json({ error: "Invalid Password" });
      }
    } else {
      res.status(401).json({ error: "User does not exist" });
    }
  });


  router.get('/logout',  function (req, res, next)  {
    // If the user is loggedin
    if (req.session.loggedin) {
          req.session.loggedin = false;
          res.redirect('/');
    }else{
        // Not logged in
        res.redirect('/');
    }
});
module.exports = router