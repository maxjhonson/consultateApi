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

  try {
    if (req.body.formType === "root") {
      const previousRoot = await Questionnaire.findOne({
        formType: "root",
      });
      if (previousRoot) {
        return res
          .status(400)
          .send(new AppError("Ya existe un formulario declarado como Raiz", 400));
      }
      if (newQuestionnaire.questions.length > 1) {
        return res
          .status(400)
          .send(
            new AppError("El formulario Raiz solo debe tener una sola pregunta", 400)
          );
      }
    }
    const response = await questionnaire.save();

    return res.status(201).send(response);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error");
  }
});

router.put("/questionnaire", async function (req, res) {
  const questionaire = req.body;
  const Questionnaire = mongoose.model("Questionnaire");
  const { _id, formType } = questionaire;

  try {
    if (formType === "root") {
      const previousRoot = await Questionnaire.findOne({
        formType: "root",
        _id: { $ne: _id },
      });
      if (previousRoot) {
        return res
          .status(400)
          .send(new AppError("Ya existe un formulario declarado como Raiz", 400));
      }
      if (questionaire.questions.length > 1) {
        return res
          .status(400)
          .send(
            new AppError("El formulario Raiz solo debe tener una sola pregunta", 400)
          );
      }
    }
    await Questionnaire.updateOne({ _id }, questionaire);
    return res.status(201).send(questionaire);
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

router.get(
  "/questionnaireRoot",
  catchAsync(async (req, res, next) => {
    const QuestionarieDb = mongoose.model("Questionnaire");
    const questionarie = await QuestionarieDb.findOne({ formType: "root" }).select(
      "_id questions formType"
    );

    if (!questionarie) return next(new AppError("Not Found", 404));
    res.status(200).send(questionarie);
  })
);

router.get(
  "/questionnaireDependent/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const QuestionarieDb = mongoose.model("Questionnaire");
    const questionarie = await QuestionarieDb.findById(id).select(
      "_id questions formType"
    );

    if (!questionarie) return next(new AppError("Not Found", 404));
    res.status(200).send(questionarie);
  })
);

router.get("/mainQuestionnaire", getMainQuestionnaire);

module.exports = router;
