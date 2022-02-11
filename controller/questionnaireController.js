const mongoose = require("mongoose");

exports.getMainQuestionnaire = async (req, res) => {
  const configurationModel = mongoose.model("Configuration");
  const questionnaireModal = mongoose.model("Questionnaire");
  const { mainQuestionnaire } = await configurationModel.findOne({ uniqueRow: 1 });
  const questionnaire = await questionnaireModal.findById(mainQuestionnaire);
  return res.send(questionnaire);
};
