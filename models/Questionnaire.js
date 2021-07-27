const mongoose = require("mongoose");
const { Schema } = mongoose;

const questionnaireSchema = new Schema({
  formName: String,
  flagUrl: String,
  questions: [
    {
      index: Number,
      text: String,
      answers: [
        {
          text: String,
          letter: String,
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Questionnaire", questionnaireSchema);
