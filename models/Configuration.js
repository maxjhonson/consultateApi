const mongoose = require("mongoose");

const configurationModal = new mongoose.Schema({
  mainQuestionnaire: String,
  uniqueRow: {
    type: Number,
    unique: true,
    require: true,
    immutable: true,
  },
});

configurationModal.pre("save", function (next) {
  this.uniqueRow = 1;
  next();
});

module.exports = mongoose.model("Configuration", configurationModal);
