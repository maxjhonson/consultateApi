const mongoose = require("mongoose");

exports.updateConfiguration = async (conf) => {
  const configuration = mongoose.model("Configuration");
  configuration.findOneAndUpdate(
    { uniqueRow: 1 },
    conf,
    { upsert: true, useFindAndModify: true },
    (err, doc) => {
      console.log(doc, conf);
    }
  );
};

exports.getConfiguration = async () => {
  const configutarionModel = mongoose.model("Configuration");
  const conf = await configutarionModel.find({ uniqueRow: 1 });
  return conf;
};
