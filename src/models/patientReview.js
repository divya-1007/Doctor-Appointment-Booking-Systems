const mogoose = require("mongoose");
const userSchema = new mogoose.Schema(
  {
    review: {
      type:  Number,
      required: true,
    },
    reaction: {
      type: String,
      required: true,
    },
     status:{ 
    default: "0",
    type: Number,
    },
    departmentId: {
      type: mogoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    departmentName: {
      type: String,
      trim: true,
    },
    doctorId: {
      type: mogoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    patientId: {
      type: mogoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointmentId: {
      type: mogoose.Schema.Types.ObjectId,
      ref: "patient",
      required: true,
    },
  },
  {timestamps: true}
);

module.exports = mogoose.model("PatientReview", userSchema);
