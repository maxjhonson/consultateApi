const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const AppError = require("../util/appError");
const catchAsync = require("./catchAsync");

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

router.get(
  "/questionnaire",
  catchAsync(async (req, res, next) => {
    const Form = mongoose.model("Questionnaire");
    const results = await Form.find();
    const allForms = results.map((form) => {
      return { _id: form._id, formName: form.formName };
    });
    res.send(allForms);
  })
);

router.post(
  "/questionnaire",
  upload.single("flag"),
  async function (req, res, next) {
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
  }
);

router.put("/questionnaire", async function (req, res) {
  const questionaire = JSON.parse(req.body.data);

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

router.get(
  "/questionnaire/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const QuestionarieDb = mongoose.model("Questionnaire");
    const questionarie = await QuestionarieDb.findById(id);
    console.log(questionarie.questions.dependentQuestions);
    const dependantAnswers = new Set(
      questionarie.questions
        .map((x) => x.dependentQuestions)
        .map((x) => x.answerId)
        .concat(questionarie.questions.dependantAnswers)
    );
    console.log(...dependantAnswers);
    questionarie.dependantAnswers = dependantAnswers;
    if (!questionarie) return next(new AppError("Not Found", 404));
    res.status(200).send(questionarie);
  })
);

module.exports = router;
