var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bodyParser = require("body-parser");
var indexRouter = require("./routes/index");
const db = require("./db");

const app = express();

const middlewares = [bodyParser.urlencoded()];

const middlewares = [bodyParser.urlencoded()];

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// app.set("view engine", "html");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

app.use("/", indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

db.connect().then(conn => {
  const appdb = conn.db("appdb");
  appdb.createCollection("cirpoTest", function(err, res) {
    if (err) throw err;
    console.log("Collection cirpoTest created!");
  });
});

module.exports = app;
