const mongoose = require("mongoose");
const { Schema } = mongoose;

const questionnaireSchema = new Schema({
  formName: String,
  flagUrl: String,
  recomendationsByCalification: [
    {
      startRange: Number,
      endRange: Number,
      recomendations: [
        {
          _id: String,
          recomendation: String,
          secondRecomendation: String,
        },
      ],
    },
  ],
  questions: [
    {
      index: Number,
      text: String,
      denpentQuestion: String,
      dependantAnswers: [String],
      dependentQuestions: [
        {
          questionId: String,
          questionText: String,
          answerId: String,
          answerText: String,
        },
      ],
      answers: [
        {
          text: String,
          letter: String,
          dependantForm: {
            formId: String,
            quantity: Number,
          },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Questionnaire", questionnaireSchema);
