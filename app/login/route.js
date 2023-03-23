const expres = require("express");
const { login } = require("./handler");
const router = expres.Router();

router.get("/", login);

module.exports = router;
