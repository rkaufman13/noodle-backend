var express = require("express");
const { SESClient, SendTemplatedEmailCommand } = require("@aws-sdk/client-ses");

const client = new SESClient({ region: "us-east-2" });

var router = express.Router();

const SESConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-2",
  apiVersion: "latest",
};

/* POST to send email to event creator on event creation. */
router.post("/", async function (req, res, next) {
  const params = req.body;
  const command = new SendTemplatedEmailCommand(params);
  console.log(params);
  try {
    const data = await client.send(command);
    res.status(200).send();
  } catch (error) {
    res.status(500).statusMessage(error).send();
  }
});

module.exports = router;
