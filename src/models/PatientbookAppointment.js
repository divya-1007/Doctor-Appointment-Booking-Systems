const mogoose = require("mongoose");
const userSchema = new mogoose.Schema(
  {
    patientName: {
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
    contactNumber: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
    },
    date: {
      type: String,
    },
    age: {
      type: String,
    },
    time: {
      type: String,
    },
    country: {
      type: String,
    },
    Comment: {
      type: String,
      required: true,
    },
    departmentId: {
      type: mogoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    departmentName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
    },
    doctorId: {
      type: mogoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullNameDoctor: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mogoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      default: "0",
    },
  },
  {timestamps: true}
);

module.exports = mogoose.model("patient", userSchema);
