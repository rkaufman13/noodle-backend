var express = require("express");
const { fromEnv } = require("@aws-sdk/credential-providers");

const credentials = fromEnv();

const { SESClient, SendTemplatedEmailCommand } = require("@aws-sdk/client-ses");

const client = new SESClient({ credentials });

var router = express.Router();

/* POST to send email to event creator on event creation. */
router.post("/", async function (req, res, next) {
  const params = req.body;
  const command = new SendTemplatedEmailCommand(params);
  console.log(params);
  try {
    const data = await client.send(command);
    res.status(200).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
