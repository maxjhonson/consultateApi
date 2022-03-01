const mongoose = require("mongoose");
const { Schema } = mongoose;

const GradeRecomendation = new Schema({
  startRange: { type: Number, require: true },
  endRange: { type: Number, require: true },
  questionnaire: { type: Schema.Types.ObjectId, ref: "Questionnaire", require: true },
  recomendations: [
    {
      type: Schema.Types.ObjectId,
      ref: "Recomendation",
      require: true,
    },
  ],
});

module.exports = mongoose.model("GradeRecomendation", GradeRecomendation);
