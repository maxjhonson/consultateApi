const mongoose = require("mongoose");
const { Schema } = mongoose;

const recomendationSchema = new Schema({
  recomendation: {
    type: String,
  },
  secondRecomendation: {
    type: String,
  },
});

module.exports = mongoose.model("Recomendation", recomendationSchema);
