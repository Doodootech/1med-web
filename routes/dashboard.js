const express = require("express");


const router = express.Router();

const app = express();

// ROUTES


router.get("/dashboard", async (req, res) => {
  res.render("dashboard");
});

module.exports = router;