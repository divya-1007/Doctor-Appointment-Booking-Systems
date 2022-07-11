const express = require("express");
const User = require("../models/User");
const Department = require("../models/department");
const Patient = require("../models/PatientbookAppointment");
const PatientReview = require("../models/patientReview");
const Fsq = require("../models/Fsq");
const TermsAndConditions = require("../models/termsAndConditions");
const Countrys = require('../models/Countrys')
const PrivacyAndPolicy = require("../models/privacyPolicy");
const sessionData = require("../middleware/session");
const router = express.Router();

/* admin */

router.get("/admin", sessionData, async (req, res) => {
  let userData = await User.find({role: "patient"});
  let doctor = await User.find({role: "doctor"});
  let doctorData = doctor.length;
  let userDatas = userData.length;
  let AppointmentsData = await Patient.find();
  let Appointmentscount = AppointmentsData.length;


  /* Latest Appointment */
 let LatestAppointment = await Patient.aggregate(
  [
     {
      $lookup:{
        from:"users", 
        localField:"userId",
        foreignField:"_id", 
        as:"Patient"
      }
    },
  ]).limit(7).sort({date:1})

  /* Start Patients Reviews Making Different Point   Display */
  /*  Doctor Display  And DoctorReviewCount Display*/
  let patientReviews = await PatientReview.aggregate([{$group:{ _id: "$doctorId",totalAmount: { $sum: { $multiply: [ "$review", ] } }, }}]);
  var patientData =[];
  for (var i = 0; i < patientReviews.length; i++) {
   var patientDatas = await User.find({_id:patientReviews[i]._id ,role:"doctor"})
   let data ={}
   data["DoctorData"] = patientDatas
   data["DoctorReviewcount"] = patientReviews[i].totalAmount
   patientData.push(data)
   }

 /*  Patient Display */
let patientReviewsfind = await PatientReview.aggregate([{$group:{_id:"$patientId"}}])
var PatientLength = patientReviewsfind.length
  let sessionData = req.session.user;
  /* End Patients Reviews Making Different Point   Display */

  res.render("admin", {
    title: "Express",
    userDatas: userDatas,
    doctorData:doctorData,
    AppointmentsData:AppointmentsData,
    Appointmentscount:Appointmentscount ,
    patientData:patientData,
    patientReviews:patientReviews,
    LatestAppointment:LatestAppointment,
    PatientLength:[{PatientLength}],
    user: req.session.user,
  });
});

router.get("/adminProfile",sessionData, async (req, res) => {
var respData = req.session.user
  const Admin = await User.findById({_id:respData._id,role:"admin"})
  res.render("adminProfileData", {
    title: "Express",
    Admin:Admin,
    user: req.session.user,
    token: req.session.token,
  });
  
});

/* Admin Appoiments List Contains */
router.get("/AdminAppointmentList",sessionData, async (req, res) => {
const departments = await Department.find();

if(req.query.filte_date && req.query.filte_date != "all" ){
var referers = req.query.filte_date;
var datas = await Patient.find({date:referers ,status:"0"});
}else {
 var datas =  await Patient.aggregate(
  [
     {
      $lookup:{
        from:"users", 
        localField:"userId",
        foreignField:"_id", 
        as:"Patient"
      }
    },
  ])
}
 
var today = new Date().toISOString().slice(0, 10)
var tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)

date = new Date(tomorrow);
year = date.getFullYear();
month = date.getMonth()+1;
dt = date.getDate();

if (dt < 10) {
  dt = '0' + dt;
}
if (month < 10) {
  month = '0' + month;
}
var tomorrowDate = year+'-' + month + '-'+dt

res.render("AdminAppoimentList", {
  title: "Express",
  datas:datas,
  today:today,
  tomorrowDate:tomorrowDate,
  departments:departments,
  user: req.session.user,
  token: req.session.token,
});
});

/* Admin Depertment Contains */
router.get("/adminAddDepertment",sessionData, async (req, res) => {
  let departments = await Department.find();
  res.render("adminAddDepertment", {
    title: "Express",
    departments: departments,
    user: req.session.user,
    token: req.session.token,
  });
});

router.get("/adminAddDepertment/:id",sessionData, async (req, res) => {
  let departments = await Department.find();
  res.render("adminAddDepertment", {
    title: "Express",
    id: req.params.id,
    departments: departments,
    user: req.session.user,
    token: req.session.token,
  });
});

/* Admin Doctors Contains */
router.get("/adminDoctorList", sessionData, async (req, res) => {
  let details = await User.find({role: "doctor"});
  const departments = await Department.find();
    res.render("adminDoctorList", {
      title: "Express",
      details: details,
      departments: departments,
      user: req.session.user,
      token: req.session.token,
    });
});

router.get("/adminAddDoctor",sessionData, async (req, res) => {

  const departments = await Department.find();
   let details = await User.find({role: "doctor"});

    res.render("adminAddDoctor", {
      title: "Express",
      details:details,
      departments: departments,
      user: req.session.user,
      token: req.session.token,
    });
});

router.get("/adminDoctorProfileUpdate/:_id", sessionData, async (req, res) => {

  let departments = await Department.find();
  let countryData = await Countrys.find();
   if (req.params._id.match(/^[0-9a-fA-F]{24}$/)) {
  var responseData = await User.findById({_id: req.params._id});
  var tempArray =[]
  let professionalExp = responseData.ProfessionalExperience;
  for (var i = 0; i < professionalExp.length; i++) {
    var tempData ={}
     tempData["ProfessionalExperience"] = responseData.ProfessionalExperience[i];
     tempData["HospitalExperienceName"] = responseData.HospitalExperienceName[i];
    tempData["Date"] =  responseData.ExperienceDate[i] + " To " + responseData.ExperienceTODate[i];
    tempArray.push(tempData)

  }
  var patientReview = await PatientReview.find({doctorId: responseData._id});
  var patientData ;
  for (var i = 0; i < patientReview.length; i++) {
   let patientDatas = await User.find({_id:patientReview[i].patientId ,role:"patient"})
   patientData = patientDatas
   }
   }
   res.render("adminDoctorProfileUpdate", {
    title: "Express",
    id: req.params._id,
    patientData:patientData,
    countryData:countryData,
    responseData: responseData,
    tempArray:tempArray,
    patientReview: patientReview,
    departments: departments,
    user: req.session.user,
    token: req.session.token,
  });
})

/* Admin Patients Contains */
router.get("/adminAllPatientList", sessionData, async (req, res) => {

  let details = await User.find({role: "patient"});
  const departments = await Department.find();
    res.render("adminAllPatientList", {
      title: "Express",
      details: details,
      departments: departments,
      user: req.session.user,
      token: req.session.token,
    });
});

router.get("/adminAddpatient", sessionData, async (req, res) => {
  let details = await User.find({role: "doctor"});
  const departments = await Department.find();
    res.render("adminAddpatient", {
      title: "Express",
      departments: departments,
      details: details,
      user: req.session.user,
      token: req.session.token,
    });
});

router.get("/adminPatientPeofile/:id", sessionData, async (req, res) => {

  var doctorArray = [];
   if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
  var responseData = await User.findById({_id: req.params.id});
  var patientData =  await Patient.find({userId: req.params.id })
  var customer_id = responseData._id;
  let patientReviewsfind = await Patient.aggregate([{ $match: { userId: customer_id } },{ $group: { _id: "$doctorId", } },])

  for(var i =0;i<patientReviewsfind.length;i++){
    var patientDatas = await User.find({_id:patientReviewsfind[i]._id,role:"doctor"})
    let data ={}
    data["DoctorData"] = patientDatas
    doctorArray.push(data);
  }}
  res.render("adminPatientPeofile", {
      title: "Express",
      id: req.params.id,
      patientData: patientData,
      responseData: responseData,
      doctorArray: doctorArray,
      user: req.session.user,
      token:req.session.token,
    });
});

/* Admin Pharmacy Contains */
router.get("/adminShop",sessionData, async (req, res) => {
  res.render("adminShop", {
    title: "Express",
    user: req.session.user,
  });
});

router.get("/adminShopDetail", sessionData ,async (req, res) => {
  res.render("adminShopDetail", {
    title: "Express",
    user: req.session.user,
  });
});

router.get("/adminShopCart",sessionData, async (req, res) => {
  res.render("adminShopCart", {
    title: "Express",
    user: req.session.user,
  });
});

router.get("/adminCheckOut",sessionData, async (req, res) => {
  res.render("adminCheckOut", {
    title: "Express",
    user: req.session.user,
  });
});

/* Admin Page Contains */
router.get("/adminInvoiceList",sessionData, async (req, res) => {
  res.render("adminInvoiceList", {
    title: "Express",
    user: req.session.user,
  });
});

router.get("/adminInvoice/:email",sessionData, async (req, res) => {
  const patientData = await User.find({_id: req.params.email});
  const patient = await Patient.findOne({_id: req.params.email});
  console.log(patient);
  res.render("adminInvoice", {
    title: "Express",
    patient: patient,
    patientData: patientData,
    user: req.session.user,
    token: req.session.token,
  });
});

router.get("/adminFsq",sessionData, async (req, res) => {
  var dataFsq1 = await Fsq.find();
  var dataFsq2 = await Fsq.find({
    questionsType: "Text Consultations Questions",
  });
  var dataFsq3 = await Fsq.find({
    questionsType: "Patient Health Data & Records Questions",
  });
  var dataFsq4 = await Fsq.find({
    questionsType: "About the Doctris Practice Questions",
  });
  res.render("adminFsq", {
    title: "Express",
    dataFsq1: dataFsq1,
    dataFsq2: dataFsq2,
    dataFsq3: dataFsq3,
    dataFsq4: dataFsq4,
    token: req.session.token,
    token: req.session.token,
    user: req.session.user,
  });
});

router.get("/adminTermConditions",sessionData, async (req, res) => {
  var dataFsq1 = await TermsAndConditions.find();
  res.render("adminTermConditions", {
    title: "Express",
    dataFsq1: dataFsq1,
    user: req.session.user,
    token: req.session.token,
  });
});

router.get("/adminprivacyPolicy",sessionData, async (req, res) => {
  var privacy = await PrivacyAndPolicy.find();
 
  res.render("adminprivacyPolicy", {
    title: "Express",
    privacy:privacy,
     user: req.session.user,
    token: req.session.token,
  });
});

router.get("/depertments",sessionData, async (req, res) => {
  const departments = await Department.find();
  res.render("depertments", {
    departments:departments,
    user: req.session.user,
    token: req.session.token,
  });
});

module.exports = router;


