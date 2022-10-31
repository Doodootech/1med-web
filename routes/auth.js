//Imports

const express = require('express');

const User = require('../models/User');

const bcrypt = require('bcrypt');

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
    const body = req.body;

    if (!(body.userName && body.email && body.password)) {
      return res.status(400).send({ error: "Data not formatted properly" });
    }

    // creating a new mongoose doc from user data
    const user = new User(body);
    // generate salt to hash password
    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    user.password = await bcrypt.hash(user.password, salt);
    user.save().then((doc) => res.redirect("../dashboard/patients"));
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

module.exports = router