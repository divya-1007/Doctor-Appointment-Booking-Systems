const express = require("express");
const User = require("../models/User");
const Department = require("../models/department");
const Patient = require("../models/PatientbookAppointment");
const PatientReview = require("../models/patientReview");
const fsq = require("../models/Fsq")
const router = express.Router();
const sessiontokentverify = require("../middleware/session");
const hbs = require('hbs')
const PrivacyAndPolicy = require("../models/privacyPolicy");
const TermsAndConditions = require("../models/termsAndConditions");
const Fsq = require("../models/Fsq");
const jwt = require("jsonwebtoken");
const Countrys = require('../models/Countrys')
var passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const bcrypt = require("bcrypt");


// CLIENT
// session check

router.get("/", async(req, res) => {

  const departmen = await Department.find().limit(4).sort({departmentName:1})
  const Doctor = await User.find({role:"doctor"}).limit(4)
   const MondayDoctor = await User.find({role:"doctor" }).limit(4)
  var patientreviews  = await PatientReview.aggregate(
  [
     {
      $lookup:{
        from:"users", 
        localField:"patientId",
        foreignField:"_id", 
        as:"PatientData"
      }
    },
  ])

/*Positive feedback */
 let patientReviewsCount = await PatientReview.aggregate( [
    { $match : { review: { $gt: 2 } } },
    { $group: { _id: "totals", total: { $sum : "$review" } } }
] );


 let DoctorExperience = await User.find({role:"doctor"})
 var TimeTable = [];
  var ExperienceCount = 0 ;
 
  /* Doctor Time Table */
  for (var i = 0; i < DoctorExperience.length; i++) {
    if(DoctorExperience[i].Monday || DoctorExperience[i].Tuesday || DoctorExperience[i].Wednesday ||
      DoctorExperience[i].Thursday || DoctorExperience[i].Friday || DoctorExperience[i].Saturday || DoctorExperience[i].Sunday){
      TimeTable.push(DoctorExperience[i])     
    }

  /* Doctor Experience Count */
    var toDate = DoctorExperience[i].ExperienceDate
     var fromDate = DoctorExperience[i].ExperienceTODate
    if( toDate.length>0  && fromDate.length>0  ){
     var invidualExprience = 0
       for(var k = 0; k <toDate.length; k++){
         let toloopData = toDate[k]
         let fromloopData = fromDate[k]
         var tosplitData = toloopData.split('-')
         var fromsplitData = fromloopData.split('-')
         let d1 = new Date(tosplitData[0],tosplitData[1],tosplitData[2]).getTime()
         let d2 = new Date(fromsplitData[0],fromsplitData[1],fromsplitData[2]).getTime()

        let date1 = new Date(d1);
        let date2 = new Date(d2);
        var yearsDiff =  date2.getFullYear() - date1.getFullYear();
        if(yearsDiff>1){
         invidualExprience += 1;
        }
       }
         if(invidualExprience>0){
         ExperienceCount += 1;
        }
    } 
  }
/*Questions & Answers  */
const fsqQuestion = await fsq.find().count();

const Admin = await User.find({role:"admin"})
for (var d = 0; d < Admin.length; d++) {
  var admin = Admin[d]

}
  res.render("index", {
    admin:admin,
    departmen:departmen,
    Doctor:Doctor,
    patientreviews:patientreviews,
    fsqQuestion:fsqQuestion,
    TimeTable:TimeTable,
    ExperienceCount:ExperienceCount,
    patientReviewsCount:patientReviewsCount,

  });
});

router.get("/SignUp", async (req, res) => {
  res.render("signup", {
    title: "Express",
    user: req.user,
  });
});

router.get("/SignIn", (req, res) => {
  res.render("login", {
    title: "Express",
    user: req.session.user,
    token: req.session.token,
  });
});

router.get("/AccountActivate/:id", async (req, res) => {
  console.log(req.params.id);
  res.render("signUpVarification", {
    title: "Express",
    id:req.params.id
  });
});

router.get("/dashboard", sessiontokentverify, async (req, res) => {
  var sessionData = req.session.user
  
 const departmen = await User.findById({_id:sessionData._id})
  // Appointment;
  const AppointmentsDat = await Patient.find({
    doctorId: departmen._id,
  });
  //  Approve Appointment
  const AppointmentsData = await Patient.find({
    doctorId: departmen._id,
    status: "1",
  }).count();
  //  Canceled Appointment
  const cancelAppointment = await Patient.find({
    doctorId: departmen._id,
    status: "-1",
  }).count();

  // Patients
 const Patients = await User.find({
  doctorId: departmen._id,
  role: "patient",
  departmentName: sessionData.departmentName,
});

var responseData = await User.find({_id:departmen._id });
var customer_id = responseData._id
 let patientReviewsfind = await Patient.aggregate([{ $match: { doctorId: customer_id } },{ $group: { _id: "$userId", } },])
var doctorArray = [];
 patientReviewsfind.forEach(async(element, i) => {
       let doctorData = element._id
       User.find({_id: doctorData ,role:"patient"} ).exec((error, doctor) => {
        if (error) {
          console.log(error);
        } else {
          doctor.forEach((element, i) => {
            var tempData = {};
            tempData = element;
            doctorArray.push(tempData);
          });
        }
      });
    })
    
//  Latest Appointment
    let dataid = departmen._id
 var LatestAppointment =  await Patient.aggregate(
  [
    { $match : { date:{$lt:  new Date().toISOString().slice(0, 10)},status:"0",doctorId:dataid} },
     {
      $lookup:{
        from:"users", 
        localField:"userId",
        foreignField:"_id", 
        as:"PatientData"
      }
    },
  ])

var  Appointment = await Patient.aggregate(
  [
    { $match : { date:{$gt:  new Date().toISOString().slice(0, 10)},status:"0",doctorId:dataid} },
     {
      $lookup:{
        from:"users", 
        localField:"userId",
        foreignField:"_id", 
        as:"PatientData"
      }
    },
  ])
  
// Patient's Review
  const patientReview = await PatientReview.find({doctorId:sessionData._id})
 var patientData ;
   for (var i = 0; i < patientReview.length; i++) {
   var patientDatas = await User.find({_id:patientReview[i].patientId ,role:"patient"})
   patientData = patientDatas
  }
    res.render("doctorDashboard", {
      title: "Express",
      Patients: Patients.length,
      departmen:departmen,
      patientData:patientData,
      doctorArray:doctorArray,
      cancelAppointment: cancelAppointment,
      AppointmentsData: AppointmentsData,
      AppointmentsDat: AppointmentsDat.length,
      Appointments: Appointment.length,
      LatestAppointment: LatestAppointment,
      LatestAppointments: LatestAppointment.length,
      Appointment: Appointment,
      patientReview: patientReview,
      user:req.session.user,
      token: req.session.token,
    });
});

router.get("/forgot-password", (req, res) => {
  res.render("forgotPassword", {
    title: "Express",
    user: req.session.user,
  });
});
router.get("/resertPassword/:id", async (req, res) => {
  res.render("resertPassword", {
    id: req.params.id,
  });
});
router.get("/doctorProfileSetting",sessiontokentverify, async (req, res) => {
var sessionifo = req.session.user
var UserData = await User.findById({_id:sessionifo._id,role: "doctor"});
    var departments = await Department.find();
   let countryData = await Countrys.find();
    res.render("doctorProfileSetting", {
      title: "Express",
      countryData:countryData,
      departments: departments,
      UserData:UserData,
      user: req.session.user,
      token: req.session.token,
    });
});
router.get("/appointmentBook", async (req, res) => {
  const details = await User.find();
  const departments = await Department.find();
  let countryData = await Countrys.find();
    const Admin = await User.find({role:"admin"})
for (var d = 0; d < Admin.length; d++) {
  var admin = Admin[d]
}
  res.render("appointmentBook", {
    title: "Express",
    countryData:countryData,
    details: details,
    departments: departments,
    admin:admin,
  });
});
router.get("/doctorSchedules",sessiontokentverify, async (req, res) => {
  let data = req.session.user;
  var DoctorData = await User.findById({_id:data._id,role: "doctor"});
  let patientData = await Patient.find({doctorId: data._id});
  res.render("doctorSchedules", {
    patientData: patientData,
    DoctorData:DoctorData,
    user: req.session.user,
    token: req.session.token,
  });
});
router.get("/invoices", async (req, res) => {
  res.render("invoices", {
    user: req.session.user,
  });
});
router.get("/patientList",sessiontokentverify, async (req, res) => {
  let sessionData = req.session.user;
  var DoctorData = await User.findById({_id:sessionData._id,role: "doctor"});
  const departments = await Department.find();
  var patientList = await User.find({
    doctorId: DoctorData._id,
    role: "patient",
    departmentName: DoctorData.departmentName,
  });
  res.render("patientList", {
     patientList: patientList,
    user: req.session.user,
    departments: departments,
    token: req.session.token,
  });
});
router.get("/patientReview", sessiontokentverify, async (req, res) => {
  let sessionData = req.session.user;
var DoctorData = await User.findById({_id:sessionData._id,role: "doctor"});
 const patientReview = await PatientReview.find({doctorId:DoctorData._id})
 var patientData2;
  for (var i = 0; i < patientReview.length; i++) {
   let  patientData = await User.find({_id:patientReview[i].patientId ,role:"patient"})
   patientData2 = patientData
  }
   res.render("doctorpatientReview", {
      patientReview: patientReview,
      patientData2:patientData2,
      DoctorData:DoctorData,
      user: req.session.user,
      token: req.session.token,
    })
});
router.get("/doctorTeamOne", async (req, res) => {
  const Doctor = await User.find({role:"doctor"})
  res.render("doctorTeamOne", {
    Doctor:Doctor,
  });
});
router.get("/invoiceForm/:userId",sessiontokentverify, async (req, res) => {
   if (req.params.userId.match(/^[0-9a-fA-F]{24}$/)) {
  var patientData = await User.findById({_id: req.params.userId});
   }
  res.render("invoiceForm", {
    id: req.params.userId,
    patientData: patientData,
    user: req.session.user,
    token: req.session.token,
  });
});
router.get("/doctorAppointmentList", sessiontokentverify, async (req, res) => {
  var data =req.session.user;
const departmen = await User.find({_id:data._id,role:"doctor"})
const departments = await Department.find();
if(req.query.filte_date && req.query.filte_date != "all" ){
var referers = req.query.filte_date;
for(var i = 0;i<departmen.length;i++){
    let dataid = departmen[i]._id
 var patient = await Patient.aggregate(
  [
    { $match : { date :referers ,status:"0",doctorId:dataid} },
     {
      $lookup:{
        from:"users", 
        localField:"userId",
        foreignField:"_id", 
        as:"PatientData"
      }
    },
  ])
}

}else {
for(var i = 0;i<departmen.length;i++){
    let dataid = departmen[i]._id
  var patient = await Patient.aggregate(
  [
    { $match : { doctorId:dataid,status:"0"} },
     {
      $lookup:{
        from:"users", 
        localField:"userId",
        foreignField:"_id", 
        as:"PatientData"
      }
    },
  ])
}

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

    res.render("doctorAppointmentList", {
      title: "Express",
      patient: patient,
      today:today,
      tomorrowDate:tomorrowDate,
      departments: departments,
      departmen:departmen,
      user:req.session.user,
      patientData: req.session,
      token: req.session.token,
    });
});
router.get("/profile", sessiontokentverify, async (req, res) => {
     var sessionData = req.session.user
  var DoctorData = await User.findById({_id:sessionData._id,role: "doctor"});
  let UserData = await User.find({role: "doctor"});
  var tempArray =[]
  let professionalExp = DoctorData.ProfessionalExperience;
  for (var i = 0; i < professionalExp.length; i++) {
    var tempData ={}
     tempData["ProfessionalExperience"] = DoctorData.ProfessionalExperience[i];
     tempData["HospitalExperienceName"] = DoctorData.HospitalExperienceName[i];
    tempData["Date"] =  DoctorData.ExperienceDate[i] + " To " + DoctorData.ExperienceTODate[i];
    tempArray.push(tempData)

  }
 const patientReview = await PatientReview.find({doctorId:DoctorData._id})
 var patientData1 ;
   for (var i = 0; i < patientReview.length; i++) {
   var patientDatas = await User.find({_id:patientReview[i].patientId ,role:"patient"})
   patientData1 = patientDatas
   }
  res.render("profile", {
    title: "Express",
    UserData: UserData,
    patientData1:patientData1,
    tempArray:tempArray,
    patientReview: patientReview,
    DoctorData:DoctorData,
    user:req.session.user,
    token: req.session.token,
  });
});
router.get("/aboutus", async (req, res) => {
  const Admin = await User.find({role:"admin"})
for (var d = 0; d < Admin.length; d++) {
  var admin = Admin[d]

}
   const departmen = await Department.find().limit(4).sort({departmentName:1})
  const Doctor = await User.find({role:"doctor"}).limit(4)
  res.render("about", {
    departmen:departmen,
    Doctor:Doctor,
    admin:admin,
  });
});
router.get("/contact", async (req, res) => {
    const Admin = await User.find({role:"admin"})
    for (var d = 0; d < Admin.length; d++) {
  var admin = Admin[d]
}
  res.render("contact", {
     Admin:Admin,
     admin:admin
  });
});
router.get("/depertments", async (req, res) => {
  const Admin = await User.find({role:"admin"})
for (var d = 0; d < Admin.length; d++) {
  var admin = Admin[d]
}
  const departments = await Department.find();
  res.render("depertments", {
    departments:departments,
     admin:admin
  });
});
router.get("/terms", async (req, res) => {
  const Admin = await User.find({role:"admin"})
for (var d = 0; d < Admin.length; d++) {
  var admin = Admin[d]
}
var TermsAnd = await TermsAndConditions.find();
for (var d = 0; d < TermsAnd.length; d++) {
  var TermsAndData = TermsAnd[d]  
}
  res.render("terms", {
     admin:admin,
    TermsAndData:TermsAndData,
  });
});
router.get("/privacy", async (req, res) => {
  const Admin = await User.find({role:"admin"})
for (var d = 0; d < Admin.length; d++) {
  var admin = Admin[d]
}
var privacy = await PrivacyAndPolicy.find();
for (var d = 0; d < privacy.length; d++) {
  var privacyData = privacy[d]  
}
  res.render("privacy", {
     admin:admin,
     privacyData:privacyData,
  });
});
router.get("/faqs", async (req, res) => {
  const Admin = await User.find({role:"admin"})
for (var d = 0; d < Admin.length; d++) {
  var admin = Admin[d]
}
var dataFsq1 = await Fsq.find({
    questionsType: "Doctris Practice Questions",
  });
var dataFsq2 = await Fsq.find({
    questionsType: "Text Consultations Questions",
  });
  var dataFsq3 = await Fsq.find({
    questionsType: "Patient Health Data & Records Questions",
  });
  var dataFsq4 = await Fsq.find({
    questionsType: "About the Doctris Practice Questions",
  });

  res.render("faqs", {
    admin:admin,
    dataFsq1:dataFsq1,
    dataFsq2:dataFsq2,
    dataFsq3:dataFsq3,
    dataFsq4:dataFsq4,
  });
});

router.get('/logout', sessiontokentverify,(req, res) => {
    req.session = null;
    req.destroy;
    req.logout();
    res.redirect('/SignIn');
})

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});
/* Google Sign In */ 
passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:process.env.CALLBACK_URL,
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
/*google integration in login */
router.get('/google',  passport.authenticate('google', { scope : ['email',"profile"] }));

router.get("/google/callback", function(req, res, next) {
  passport.authenticate("google", async(error, user, info)=> {
    var roleData = req.session.user_role
    if (roleData == "doctor") {
      var saltRound = 10;
       let dataPassword = bcrypt.hashSync("Test123!@#", saltRound)
        const newUser = {
          google_id:user.id,
          firstName: user.name.givenName,
          lastName: user.name.familyName,
          image: user.photos[0].value,
          email: user.emails[0].value,
          password:dataPassword,
          username: Math.random().toString()
        }
          //find the user in our database 
          let users = await User.findOne({ email:user.email})
          if (users) {
            //If user present in our database.
            if(users.role === "doctor"){
            let token = req.cookies.token ;
            console.log( req.session);
             req.session.user= users;
             req.session.token = token
             res.redirect("/dashboard" );
             }else{
              return res.render("login", {
                  error_data: "Invalid Role ...! Please Valid Role Select",
                });  
             }
           
          } else {
            // if user is not preset in our database save user data to database.
             const user = await User.create(newUser);
              const token = jwt.sign({_id: user._id, role: user.role}, process.env.JWT_SECRET,{expiresIn: "7h"});
              const {_id, firstName, lastName, email, role, fullName,} = user;
              req.session.token = token;
              req.session.user = user;
               res.cookie("token", token);
              res.redirect("/dashboard");
         }
        // res.redirect("/dashboard");
      }else if (roleData == "patient") {
             console.log(user.id);
              var saltRound = 10;
          let dataPassword = bcrypt.hashSync("Test123!@#", saltRound)
            const newUsers = {
          google_id:user.id,
          firstName: user.name.givenName,
          lastName: user.name.familyName,
          image: user.photos[0].value,
          email: user.emails[0].value,
          password:dataPassword,
          role:"patient",
          username: Math.random().toString()
        }
          //find the user in our database 
          let users = await User.findOne({ email:user.email})
          if (users) {
            //If user present in our database.
          if(users.role === "patient"){
             let token = req.cookies.token ;
             req.session.user= users;
             req.session.token = token
          res.redirect("/patientDashboard" );
          }else{
          return res.render("login", {
                error_data: "Invalid Role ...! Please Valid Role Select",
              });
          }
          } else {
           
        
            // if user is not preset in our database save user data to database.
          const user = await User.create(newUsers);
          const token = jwt.sign({_id: user._id, role: user.role}, process.env.JWT_SECRET,{expiresIn: "7h"});
              const {_id, firstName, lastName, email, role, fullName,} = user;
              req.session.token = token;
              req.session.user = user;
               res.cookie("token", token);
          res.redirect("/patientDashboard");
          }
      }
  })(req, res, next);
})

/* Google Sign In End...... */ 



module.exports = router;
