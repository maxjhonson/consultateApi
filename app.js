require("dotenv").config();
require("./models/Questionnaire");
require("./models/Rule");
require("./models/Recomendation");
require("./models/Configuration");
require("./models/GradeRecomendation");

const express = require("express");
const bodyParser = require("body-parser");

const questionnaireRoute = require("./routers/QuestionnaireRoute");
const ruleRouter = require("./routers/RuleRouter");
const app = express();
var cors = require("cors");
const AppError = require("./util/appError");
const errorHandler = require("./util/errorHandler");
const recomendationRouter = require("./routers/RecomendationRouter");
const gradeRecomendationRouter = require("./routers/GradeRecomendationRoute");
const port = process.env.PORT || 3001;
require("./config/db");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

process.on("uncaughtException", (err) => {
  console.error(err);
  process.exit(1);
});

app.use(questionnaireRoute);
app.use(recomendationRouter);
app.use(ruleRouter);
app.use(gradeRecomendationRouter);

app.all("*", (req, res, next) => {
  const errMessage = `Can't find ${req.originalUrl} on this servers`;
  next(new AppError(errMessage, 404));
});

app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

process.on("unhandledRejection", (err) => {
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
