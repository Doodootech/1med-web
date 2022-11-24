const express = require('express');
const session = require("express-session");
const { pool } = require("../dbConfig");
const User = require('../models/User');
const flash = require("express-flash");
const bcrypt = require('bcrypt');
const passport = require("passport");
const router = express.Router();
require("dotenv").config();
const initializePassport = require("../passportConfig");
initializePassport(passport);
// ROUTES
router.get('/patient', checkNotAuthenticated, (req, res) => {
  console.log(req.isAuthenticated()); 
  res.render('dashboard/patient');

});

router.get('/provider', checkNotAuthenticated, (req, res) => {
  console.log(req.isAuthenticated()); 
  res.render('dashboard/provider');

});



function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/patient-login");
}

module.exports = router;