const express = require("express");
const mongoose = require("mongoose");
const catchAsync = require("./catchAsync");

const router = express.Router();

router.get(
  "/recomendation",
  catchAsync(async (req, res, next) => {
    const Recomendation = mongoose.model("Recomendation");
    const result = await Recomendation.find();
    console.log(result);
    res.send(result);
  })
);

router.post(
  "/recomendation",
  catchAsync(async (req, res, next) => {
    const recomendation = req.body;
    const Recomendation = mongoose.model("Recomendation");
    const newRecomendation = new Recomendation(recomendation);
    const response = await newRecomendation.save();
    return res.status(201).send(response);
  })
);

router.delete(
  "/recomendation/:id",
  catchAsync(async (req, res, next) => {
    const Recomendation = mongoose.model("Recomendation");
    await Recomendation.deleteOne({ _id: req.params.id });
    return res.status(200);
  })
);

router.put(
  "/recomendation",
  catchAsync(async (req, res, next) => {
    console.log(req.body);
    const Recomendation = mongoose.model("Recomendation");
    const response = await Recomendation.updateOne(
      { _id: req.body._id },
      req.body
    );
    return res.status(201);
  })
);

module.exports = router;
