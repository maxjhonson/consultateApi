const mongoose = require("mongoose");
const { Schema } = mongoose;

const answerRecomendation = new Schema({
  ruleName: {
    type: string,
    require: true,
  },
  answersIds: [string],
  recomendationsIds: [{ type: Schema.Types.ObjectId, ref: "Recomendation" }],
});

module.exports = mongoose.model("AnswerRecomendation", answerRecomendation);
