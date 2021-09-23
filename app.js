require("dotenv").config();
require("./models/Questionnaire");
require("./models/Rule");
const express = require("express");
const bodyParser = require("body-parser");

const questionnaireRoute = require("./routers/QuestionnaireRoute");
const ruleRouter = require("./routers/RuleRouter");
const app = express();
var cors = require("cors");
const port = process.env.PORT || 3001;
require("./config/db");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

app.use(questionnaireRoute);
app.use(ruleRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
