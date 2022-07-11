const mogoose = require("mongoose");
const userSchema = new mogoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
     commentContactus: {
      type: String,
      required: true,
    },
     adminId: {
      type: mogoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
  },
  {timestamps: true}
);

module.exports = mogoose.model("ContactusQueryMag", userSchema);