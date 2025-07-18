var express = require("express");

const MailerSend = require("mailersend").MailerSend;
const Sender = require("mailersend").Sender;
const Recipient = require("mailersend").Recipient;
const EmailParams = require("mailersend").EmailParams;
require("dotenv").config();

const mailerSend = new MailerSend({ apiKey: process.env.MAILERSEND_API_KEY });
const sentFrom = new Sender("noodle@noodleapp.cool", "Noodle");

var router = express.Router();

const mailerSendTemplates = {
  eventCreated: "0p7kx4xqnrvg9yjr",
  eventRsvped: "0r83ql3jvdxgzw1j",
};

/* POST to send email to event creator on event creation. */
router.post("/", async function (req, res, next) {
  const vars = req.body;

  const recipient = [new Recipient(vars.hostEmail, vars.hostName)];

  const personalization = [
    {
      email: vars.hostEmail,
      data: {
        name: vars.hostName,
        eventName: vars.eventName,
        eventAdminUrl: vars.fullURL,
      },
    },
  ];
  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipient)
    .setReplyTo(sentFrom)
    .setSubject(`Your Nood, ${vars.eventName}, has been created`)
    .setTemplateId(mailerSendTemplates.eventCreated)
    .setPersonalization(personalization);

  try {
    mailerSend.email
      .send(emailParams)
      .then((response) => {
        res.status(200).send();
      })
      .catch((err) => res.status(500).send(err.message));
  } catch (error) {
    res.status(500).send(err.message);
  }
});

//route to send when an event gets an RSVP
router.post("/rsvp", async function (req, res, next) {
  const vars = req.body;

  const recipient = [new Recipient(vars.hostEmail, vars.hostName)];

  const personalization = [
    {
      email: vars.hostEmail,
      data: {
        name: vars.hostName,
        eventName: vars.eventName,
        eventAdminUrl: vars.fullURL,
        respondee: vars.respondee,
      },
    },
  ];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipient)
    .setReplyTo(sentFrom)
    .setSubject(`${vars.respondee} just responded to your Nood`)
    .setTemplateId(mailerSendTemplates.eventRsvped)
    .setPersonalization(personalization);

  try {
    await mailerSend.email
      .send(emailParams)
      .then((response) => {
        console.log(response);
        res.status(200).send();
      })
      .catch((err) => res.status(500).send(err.message));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
