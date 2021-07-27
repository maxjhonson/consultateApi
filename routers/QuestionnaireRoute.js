const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

var upload = multer({ storage: storage });

const router = express.Router();

router.get("/questionnaire", async function (req, res) {
  const Form = mongoose.model("Questionnaire");
  const results = await Form.find();
  const allForms = results.map((form) => {
    return { _id: form._id, formName: form.formName };
  });
  res.send(allForms);
});

router.post("/questionnaire", upload.single("flag"), async function (req, res) {
  const Questionnaire = mongoose.model("Questionnaire");
  const newQuestionnaire = JSON.parse(req.body.data);
  newQuestionnaire.flagUrl = `http://${req.headers.host}/${req.file.filename}`;
  const questionnaire = new Questionnaire(newQuestionnaire);

  try {
    const response = await questionnaire.save();
    return res.status(201).send(response);
  } catch (err) {
    return res.status(500).send("Error");
  }
});

router.put("/questionnaire", upload.single("flag"), async function (req, res) {
  const questionaire = JSON.parse(req.body.data);

  req.file !== undefined
    ? (questionaire.flagUrl = `http://${req.headers.host}/${req.file.filename}`)
    : null;

  const Questionnaire = mongoose.model("Questionnaire");
  const { _id } = questionaire;
  try {
    const response = await Questionnaire.updateOne({ _id }, questionaire);
    const questionaireUpdated = await Questionnaire.findById(_id);
    return res.status(201).send(questionaireUpdated);
  } catch (err) {
    return res.status(500).send("Error");
  }
});

router.get("/questionnaire/:id", async function (req, res) {
  const { id } = req.params;
  const QuestionarieDb = mongoose.model("Questionnaire");
  const questionarie = await QuestionarieDb.findById(id);
  res.status(200).send(questionarie);
});

module.exports = router;
