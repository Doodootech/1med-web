const express = require("express");


const router = express.Router();

const app = express();

// ROUTES


router.get("text", async (req, res) => {
  res.render("text");
});

module.exports = router;