const express = require('express');

const User = require('../models/User');

const bcrypt = require('bcrypt');

const router = express.Router();



// ROUTES
router.get('/patient', (req, res) => {
  const body = req.body;
    const user =  User.findOne({ email: body.email });
  if (user) {
  
  res.render('dashboard/patient');
  } else {
    res.redirect("./login");
  }
});



module.exports = router;