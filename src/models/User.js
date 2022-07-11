const mogoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mogoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 20,
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    email: {
      type: String,
      index: true,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["doctor", "admin", "patient"],
      default: "doctor",
    },
    contactNumber: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    departmentId: {
      type: mogoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    departmentName: {
      type: String,
      trim: true,
    },
    qualification: {
      type: String,
    },
    specialties: {
      type: String,
    },
    location :{
    type: String,
    },
    date: {
      type: String,
    },
    birthday: {
      type: String,
    },
    bloodGroup: {
      type: String,
    },
    age: {
      type: String,
    },
    gender: {
      type: String,
    },
     bio: {
      type: String,
    },
     country: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    address: {
      type: String,
    },
    pincode: {
      type: String,
    },
    instagram: {
       type: String
      },
    facebook: {
      type: String
    },
    linkedin: {
       type: String
      },
    twitter: {
      type: String
    },
    google_id: {
      type: String
    },
    ProfessionalExperience: [
      {
        type: String,
      },
    ],
    HospitalExperienceName: [
      {
        type: String,
      },
    ],
    ExperienceDate: [
      {
        type: String,
      },
    ],
    ExperienceTODate: [
      {
        type: String,
      },
    ],
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    Monday: {
      type: String,
    },
    Tuesday: {
      type: String,
    },
    Wednesday: {
      type: String,
    },
    Thursday: {
      type: String,
    },
    Friday: {
      type: String,
    },
    Saturday: {
      type: String,
    },
    Sunday: {
      type: String,
    },
     doctorId: {
      type: String,
    },
    fullNameDoctor: {
      type: String,
    },
    status:{ 
    default: "0",
    type: Number,
    },
  },
  {timestamps: true}
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});
userSchema.methods = {
  authenticate: function (password) {
    return bcrypt.compare(password, this.password);
  },
};


module.exports = mogoose.model("User", userSchema);
