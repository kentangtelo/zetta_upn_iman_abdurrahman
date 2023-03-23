const express = require("express");
const { bookPurchase } = require("./handler");
const checkAuth = require("../../middleware/checkAuth");
const router = express.Router();

router.post("/", checkAuth, bookPurchase);

module.exports = router;
