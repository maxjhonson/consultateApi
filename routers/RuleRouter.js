const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.post("/rule", async function (req, res) {
  const Rule = mongoose.model("Rule");
  //const newRule = JSON.parse(req.body);
  const rule = new Rule(req.body);

  try {
    const response = await rule.save();
    return res.status(201).send(response);
  } catch (err) {
    return res.status(500).send("Error");
  }
});

router.get("/rule", async function (req, res) {
  const Rule = mongoose.model("Rule");
  const response = await Rule.find({ formId: req.query.formId });
  return res.status(200).send(response);
});

router.delete("/rule/:id", async function (req, res) {
  const { id } = req.params;
  console.log(id);
  const Rule = mongoose.model("Rule");
  const response = await Rule.deleteOne({ _id: id });
  return res.status(200).send(response);
});
/* */
module.exports = router;
