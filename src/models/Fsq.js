const mogoose = require("mongoose");
const userSchema = new mogoose.Schema(
  {
    questionsType: {
      type: String,
      required: true,
    },
    questions: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  {timestamps: true}
);

module.exports = mogoose.model("Fsq", userSchema);
