const mogoose = require("mongoose");
const userSchema = new mogoose.Schema(
  {
    Overview: {
      type: String,
      required: true,
    },
      information : {
      type: String,
      required: true,
    },
      ProvidedVoluntarily : {
      type: String,
      required: true,
    },
  },
  {timestamps: true}
);

module.exports = mogoose.model("privacyAndPolicy", userSchema);