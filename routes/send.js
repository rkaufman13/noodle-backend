var express = require("express");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var router = express.Router();

/* POST to send email to event creator on event creation. */
router.post("/", async function (req, res, next) {
  const params = req.body;
  console.log(params);
  try {
    const data = await sgMail.send(params);
    res.status(200).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
