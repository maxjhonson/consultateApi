const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.post("/gradeRecomendation", async (req, res) => {
  var newId = mongoose.Types.ObjectId();
  const GradeRecomendation = mongoose.model("GradeRecomendation");
  const newGradeRecomendation = new GradeRecomendation({ ...req.body, _id: newId });
  try {
    const savedGrade = await newGradeRecomendation.save();
    console.log(savedGrade);
    res.status(201).send(savedGrade);
  } catch {
    res.status(500).send("Error");
  }
});

router.put("/gradeRecomendation", async (req, res) => {
  const GradeRecomendation = mongoose.model("GradeRecomendation");
  console.log(req.body._id);
  try {
    const updated = await GradeRecomendation.updateOne({ _id: req.body._id }, req.body);
    console.log(updated);
    res.status(201).send("ok");
  } catch {
    res.status(500).send("Error");
  }
});

router.get("/gradeRecomendation", async (req, res) => {
  const { questionnaireId } = req.query;
  const GradeRecomendation = mongoose.model("GradeRecomendation");
  try {
    const results = await GradeRecomendation.find({ questionnaire: questionnaireId });
    res.status(201).send(results);
  } catch (err) {
    res.status(500).send("Error");
  }
});

router.delete("/gradeRecomendation/:id", async (req, res) => {
  console.log(req.params.id);
  const GradeRecomendation = mongoose.model("GradeRecomendation");
  try {
    await GradeRecomendation.deleteOne({ _id: req.params.id });
    res.status(201).send("ok");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

module.exports = router;
