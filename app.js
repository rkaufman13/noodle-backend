var createError = require("http-errors");
var express = require("express");
var cors = require("cors");
var logger = require("morgan");
var rateLimit = require("express-rate-limit");

var healthRouter = require("./routes/healthcheck");
var sendRouter = require("./routes/send.js");

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//for nginx
app.set("trust proxy", true);
app.set("trust proxy", "loopback");

const allowedOrigins = ["https://noodleapp.cool", "https://www.noodleapp.cool"];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["POST", "GET"],
  })
);
app.use(limiter);

app.use("/api/healthcheck", healthRouter);
app.use("/api/send", sendRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
