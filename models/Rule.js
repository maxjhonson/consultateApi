const mongoose = require("mongoose");
const { Schema } = mongoose;

const ruleSchema = new Schema({
  formId: String,
  ruleName: String,
  ruleValue: Number,
  recomendations: [String],
  questionsRule: [
    {
      text: String,
      questionId: String,
      answers: [
        {
          text: String,
          answerId: String,
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Rule", ruleSchema);
