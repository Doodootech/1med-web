const express = require('express');

const User = require('../models/User');
const router = express.Router();

//route

router.get('/all', (req, res) => {
  const body = req.body;
    const user =  User.findOne({ email: body.email });
  if (user) {
  
  res.render('medreports/all');
  } else {
    res.redirect("./login");
  }
});

module.exports = router;