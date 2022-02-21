const express = require("express");
const { route } = require("express/lib/application");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const { updateConfiguration } = require("../controller/configurationController");
const { getMainQuestionnaire } = require("../controller/questionnaireController");
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
      return { _id: form._id, formName: form.formName, formType: form.formType };
    });
    res.send(allForms);
  })
);

router.post("/questionnaire", upload.single("flag"), async function (req, res, next) {
  const Questionnaire = mongoose.model("Questionnaire");
  const newQuestionnaire = req.body;
  const questionnaire = new Questionnaire(newQuestionnaire);
  const { isPrincipalForm } = newQuestionnaire;
  try {
    const response = await questionnaire.save();
    if (isPrincipalForm) updateConfiguration({ principalForm: newQuestionnaire._id });
    questionaireUpdated.isPrincipalForm = isPrincipalForm;
    return res.status(201).send(response);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error");
  }
});

router.put("/questionnaire", async function (req, res) {
  const questionaire = req.body;
  const Questionnaire = mongoose.model("Questionnaire");
  const { _id } = questionaire;
  const { isPrincipalForm } = questionaire;
  try {
    await Questionnaire.updateOne({ _id }, questionaire);
    const questionaireUpdated = await Questionnaire.findById(_id);
    if (isPrincipalForm) updateConfiguration({ principalForm: questionaire._id });
    questionaireUpdated.isPrincipalForm = isPrincipalForm;
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
    questionarie.questions.forEach((que, i) => {
      console.log(
        i,
        que.dependentQuestions.map((y) => y.answerId)
      );
      const dependantAnswers = new Set(
        que.dependentQuestions.map((y) => y.answerId).concat(que.dependantAnswers)
      );

      questionarie.questions[i].dependantAnswers = [...dependantAnswers];
    });

    if (!questionarie) return next(new AppError("Not Found", 404));
    res.status(200).send(questionarie);
  })
);

router.get("/mainQuestionnaire", getMainQuestionnaire);

module.exports = router;
