const mogoose = require("mongoose");
const userSchema = new mogoose.Schema(
  {
    Introduction: {
      type: String,
      required: true,
    },
    UserAgreements:{
      type: String,
      required: true,
    },
    Restrictions:{
      type: String,
      required: true,
    }
  },
  {timestamps: true}
);

module.exports = mogoose.model("TermsAndConditions", userSchema);
