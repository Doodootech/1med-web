const express = require("express");


const router = express.Router();

const app = express();

// ROUTES


router.get("/", async (req, res) => {
  res.render("index");
});

module.exports = router;