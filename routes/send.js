var express = require("express");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var router = express.Router();

const sendGridTemplates = {
  eventCreated: "d-1c0fd3f9eb674287b5eb839deb958cf0",
  eventRsvped: "d-6e89baf471ab478682b2757a40fbe4fe",
};

/* POST to send email to event creator on event creation. */
router.post("/", async function (req, res, next) {
  const vars = req.body;

  const params = {
    from: {
      email: "noodle@noodleapp.cool",
    },
    personalizations: [
      {
        to: [{ email: vars.hostEmail }],
        dynamic_template_data: {
          name: vars.hostName,
          eventName: vars.eventName,
          eventAdminUrl: vars.fullURL,
        },
      },
    ],
    template_id: sendGridTemplates.eventCreated,
  };

  try {
    const data = await sgMail.send(params);
    console.log(data);
    res.status(200).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//route to send when an event gets an RSVP
router.post("/rsvp", async function (req, res, next) {
  const vars = req.body;

  const params = {
    from: {
      email: "noodle@noodleapp.cool",
    },
    personalizations: [
      {
        to: [{ email: vars.hostEmail }],
        dynamic_template_data: {
          name: vars.hostName,
          eventName: vars.eventName,
          eventAdminUrl: vars.fullURL,
          respondee: vars.respondee,
        },
      },
    ],
    template_id: sendGridTemplates.eventRsvped,
  };

  try {
    const data = await sgMail.send(params);
    console.log(data);
    res.status(200).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
