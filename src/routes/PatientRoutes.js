const express = require("express");
const User = require("../models/User");
const Department = require("../models/department");
const Patient = require("../models/PatientbookAppointment");
const PatientReview = require("../models/patientReview");
const sessionAuth = require("../middleware/session");
const Fsq = require("../models/Fsq");
const Countrys = require('../models/Countrys')
const States = require('../models/States')
const TermsAndConditions = require("../models/termsAndConditions");
const router = express.Router();

let Country = require('country-state-city').Country;
let State = require('country-state-city').State;
let City = require('country-state-city').City;
let country = Country.getAllCountries()
// let city1 = City.getAllCities()

// for(let i =0;i<country.length;i++){
//  const users = new Countrys({country:country[i] });
//     users.save((error, user) => {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log( i,user.country ,"! Department Insert Successfully");
//         // res.send({
//         //   status: 200,
//         //   message: "Department Insert Successfully.",
//         //   user: req.session,
//         // });
//       }
//     });
// }
// console.log(Country.getAllCountries() ,"country")
// console.log(State.getAllStates(),"state")
// console.log(City.getCitiesOfCountry('In'),"city")

/* Patient Dashboard Contains */
router.get("/patientDashboard",sessionAuth, async (req, res) => {
    let sessionData = req.session.user;
  let emails = sessionData._id;
  var patientDetail = await User.findById({_id: sessionData._id});
  let details = await Patient.find({userId: emails});
    res.render("patientDashboard", {
      title: "Express",
      details: details,
      patientDetail:patientDetail,
      token: req.session.token,
      user:req.session.user,
    });
});

router.get("/patientProfile",sessionAuth, async (req, res) => {
   var sessioninfo = req.session.user;
  var patientDetail = await User.findById({_id: sessioninfo._id});
  const departments = await Department.find();
    res.render("patientProfile", {
      title: "Express",
      departments: departments,
      patientDetail:patientDetail,
      user: req.session.user,
      token: req.session.token,
    });
});

router.get("/patientPyt", sessionAuth, async (req, res) => {
  let responsedata = req.session.user;
  let PatientDetails = await Patient.find({userId:responsedata._id });
   var patientDetail = await User.findById({_id: responsedata._id ,role:"patient"});
    res.render("patientPyt", {
      title: "Express",
      id:req.params.userId ,
      patientDetail:patientDetail,
      PatientDetails: PatientDetails,
      user: req.session.user,
      token: req.session.token,
    });
});

router.get("/patientReviws/:id",sessionAuth, async (req, res) => {
  let responseData = req.session.user;
  const departments = await Department.find();
  const patientReview = await PatientReview.find({patientId:responseData._id})
    res.render("patientReviws", {
      title: "Express",
      id: req.params.id,
      departments: departments,
      patientReview: patientReview,
      responseDatas:[responseData],
      user: req.session.user,
      token: req.session.token,
    });
});

module.exports = router;


