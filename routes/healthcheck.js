var express = require("express");
var router = express.Router();

/* GET healthcheck */
router.get("/", function (req, res, next) {
  res.send("the server is healthy");
});

module.exports = router;
