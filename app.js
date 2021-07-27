require("dotenv").config();
require("./models/Questionnaire");
const express = require("express");

const questionnaireRoute = require("./routers/QuestionnaireRoute");
const app = express();
var cors = require("cors");
const port = process.env.PORT || 3001;
require("./config/db");
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/public"));

app.use(questionnaireRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
