 require('dotenv').config();
const User = require("../models/User");
const Department = require("../models/department");
const Patient = require("../models/PatientbookAppointment");
const jwt = require("jsonwebtoken");
const { status } = require("express/lib/response");
const States = require('../models/States')
const Countrys = require('../models/Countrys')
const PatientReview = require("../models/patientReview");
var async = require("async");
var crypto = require("crypto");
const bcrypt = require("bcrypt");
var nodemailer = require("nodemailer");
const { body } = require("express-validator");
var SibApiV3Sdk = require('sib-api-v3-sdk');
const {use}=require('chai');
var apiData = process.env.EMAIL_API_KEY
var defaultClient = SibApiV3Sdk.ApiClient.instance;
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = apiData
 


 /*Signup */
exports.UserSignup = async (req, res) => {
  try {
    const {firstName, lastName, email, contactNumber, password} = req.body;
    if (!firstName || !lastName || !email || !password || !contactNumber) {
      return res.send( {status:500, message: "All Field are require"});
    } else if (!/^[a-zA-Z. ]+$/.test(firstName)) {
      return res.send({status: 500,message: "First Name Must be contain Latter"});
    } else if (!/^[a-zA-Z. ]+$/.test(lastName)) {
      return res.send({status: 500,message: "Last Name be Must be contain Latter"});
    } else if (!/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/i.test(contactNumber)) {
      return res.send({status: 500, message: "Must contain at least  number 10 digit"});
    } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,14}$/.test(password)) {
      return res.send({status: 500,message:"Must contain at least one uppercase letter and one lowercase letter and number , and at least 8 or more characters",
      });
    }

    await User.findOne({email: req.body.email}).exec((error, user) => {
    if (user) {
    return res.send({status: 200,message:"User Already exist",});
    }else if (user == null) {
    const { firstName,lastName,email,contactNumber,password,} = req.body;
    var saltRound = 10;
    bcrypt.hashSync(req.body.password, saltRound)
    const users = new User({ firstName,lastName,email,contactNumber,password,username: Math.random().toString()});
    users.save(function (err,user) {
  var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); 
  sendSmtpEmail = {
    sender: { email: "noreply@easeaccount.in" },
    to: [
      {
        email: user.email,
        name: user.firstName +user.lastName,
      },
    ],
    subject: "Please Verify Your Account",
    htmlContent:'<div style="max-width:640px;margin:0 auto;box-shadow:0px 1px 5px rgba(0,0,0,0.1);border-radius:4px;overflow:hidden"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#396cf0 url(https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png) top center / cover no-repeat;" align="center" border="0" background="https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png"><tbody><tr>'+
              '<td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:57px;"> <div style="cursor:auto;color:white;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:36px;font-weight:600;line-height:36px;text-align:center;">Welcome Doctor Appointment Booking System</div></td></tr></tbody></table><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#ffffff;" align="center" border="0"> <tbody>'+
              '<tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 70px;"><div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody> <tr> <td style="word-break:break-word;font-size:0px;padding:0px 0px 20px;" align="left"><div style="cursor:auto;color:#737F8D;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:16px;line-height:24px;text-align:left;"><h2 style="font-family: Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-weight: 500;font-size: 20px;color: #4F545C;letter-spacing: 0.27px;">'+user.firstName+' '+user.lastName+',</h2><p>Wowwee! Thanks for registering an account with Doctor Appointment Booking System! You are the coolest person in all the land (and I have met a lot of really cool people).</p> <p>Before we get started, well need to verify your email.</p></div></td> </tr>'+
              '<tr><td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:separate;" align="center" border="0"><tbody><tr><td style="border:none;border-radius:3px;color:white;cursor:auto;padding:15px 19px;" align="center" valign="middle" bgcolor="#396cf0">'+
              '<a href="http://easeaccount.in'+
              "/AccountActivate/"+
              user._id+
              '"style="text-decoration:none;line-height:100%;background:#396cf0;color:white;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:15px;font-weight:normal;text-transform:none;margin:0px;">Verify Email</a></td></tr></tbody></table> </td></tr></tbody></table></div></td> </tr></tbody></table></div>'
  }
// #396cf0 
  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log("API called successfully. Returned data: " + data);
    },
    function (error) {
      console.error(error);
    });
   res.send({status: 200, message: "Your Account is created Successfully...!!! Please check your email and Verify your Account."});
    });
  } else{
    console.log("hello");
    return res.send({status:200 ,message: "This email is registered previously!\n you need to login"});
  }
  });
} catch (error) {
  res.status(500).json({msg: error});
}
};

exports.signupVarification = async (req, res, next) => {
  try {
  var statusData = { status: 1};
  var idData = req.body._id
   await User.findByIdAndUpdate(idData, {status: 1} ,{
      useFindAndModify: false,
    }).exec((error, data) => {
      if (error){
        console.log(error);
      }else{
      if(data.status === 1){
        console.log(data);
       res.send({status: 200,  datas: data.status, message: "Your Account is Verify  Successfully.....! Please SignIn Your Account "}); 
      }
    }
    });
  } catch (error) {
    res.status(500).json({msg: console.log(error)});
  }
};

 /* SignIn */
exports.UserSignin = async (req, res) => {
  try {
     const {email, password} = req.body;
  if (!email || !password) {
    return res.send({status: 500,message:"Please Enter Email & Password",});
  } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,14}$/.test(password)) {
   return res.send({status: 500,message:"Must contain at least one uppercase letter and one lowercase letter and number , and at least 8 or more characters", });
  }

    await User.findOne({email: req.body.email}).exec((error, user) => {
      // console.log(user);
      if (user === null) {
        return res.send({status: 500,message: "Invalid Email...! Please enter valid Email...!!!"});
      }else if(user.google_id){
       return res.send({status: 500,message: "You are SignUp in google....! Please SignIn in google...!!!!! "});
      } else if(user.status !== 1){
        console.log(user.status);
      return res.send({status: 500,message: "Your Account is not Verify...! Please Varify Your Account"});
      }else if(user){
      var passwordIsValid = bcrypt.compareSync(req.body.password,user.password);
      if (!passwordIsValid ) {
        return res.send( {status: 500,message: "Invalid Password...! Please enter valid Password"});
      }
      
      const token = jwt.sign({_id: user._id, role: user.role}, process.env.JWT_SECRET,{expiresIn: "7h"});
      const {_id, firstName, lastName, email, role, fullName} = user;
      req.session.token = token;
      req.session.user = user;
      res.cookie("token", token);
      res.send({
        status: 200,
        role: user.role,
        message:"Sign In Successfully....!!!!"
      });
      
       }else{
         return res.send({status: 200,message: "Your Account not Activated"});
       }
    });
  } catch (error) {
    res.status(500).json({msg: error});
  }
};

/* Doctor Update */
exports.UserUpdate = async (req, res) => {
  try {
 let department = req.body.departmentId;
 let locationData = req.body.location;
 const {firstName, lastName, qualification, contactNumber} = req.body;
if (!firstName || !lastName || !qualification || !department ||!locationData) {
  return res.send({status: 500, message: "All Field are required"});
} else if (!/^[a-zA-Z. ]+$/.test(firstName)) {
  return res.send({
    status: 500,
    message: "First Name Must be contain Latter",
  });
} else if (!/^[a-zA-Z. ]+$/.test(lastName)) {
  return res.send({
    status: 500,
    message: "Last Name be Must be contain Latter",
  });
}else if (!/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/i.test(contactNumber)){
return res.send({
  status: 500,
  message: "Must contain at least  number 10 digit",
});
}else if(req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/png' && req.file.mimetype !== 'image/jpg'){
return res.send({
  status: 500,
  message: "Please Upload Only image png ,jpg and jepg",
});
}

let splitData = department.split("#");
let departmentId = splitData[0];
let departmentName = splitData[1];
let countryData = req.body.country
let countrySplit = countryData.split('#')
let country1 =  countrySplit[0];
let country = countrySplit[1]
let locat = locationData.split('"');
let loc1 = locat[1]
 var locationLink = loc1

var data = req.session.user;
var id = data._id;
var recodeData;
  if (data)
    if (req.file) {
      recodeData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        contactNumber: req.body.contactNumber,
        departmentId: departmentId,
        departmentName: departmentName.charAt(0).toUpperCase() + departmentName.slice(1),
        qualification: req.body.qualification,
        specialties: req.body.specialties,
        country: country,
        state: req.body.state,
        city: req.body.city,
        address: req.body.address,
        pincode: req.body.pincode,
        profilePicture: req.file.filename,
        instagram: req.body.instagram,
        facebook: req.body.facebook,
        linkedin: req.body.linkedin,
        twitter: req.body.twitter,
        bio: req.body.bio,
        location:locationLink,
        ProfessionalExperience: req.body.ProfessionalExperience,
        HospitalExperienceName: req.body.HospitalExperienceName,
        ExperienceDate: req.body.ExperienceDate,
        ExperienceTODate: req.body.ExperienceTODate,
      };
    } else {
      recodeData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        contactNumber: req.body.contactNumber,
        departmentId: departmentId,
        departmentName:departmentName.charAt(0).toUpperCase() + departmentName.slice(1),
        qualification: req.body.qualification,
        specialties: req.body.specialties,
        country: country,
        state: req.body.state,
        city: req.body.city,
        address: req.body.address,
        pincode: req.body.pincode,
        instagram: req.body.instagram,
        facebook: req.body.facebook,
        linkedin: req.body.linkedin,
        twitter: req.body.twitter,
        bio: req.body.bio,
        location:locationLink,
        ProfessionalExperience: req.body.ProfessionalExperience,
        HospitalExperienceName: req.body.HospitalExperienceName,
        ExperienceDate: req.body.ExperienceDate,
        ExperienceTODate: req.body.ExperienceTODate,
      };
    }
    await User.findByIdAndUpdate(id, recodeData, {
      useFindAndModify: false,
    }).exec((error, data) => {;
      if (error) throw console.error();
      res.send({status: 200, message: "Profile Updated Successfully."});
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "data not found"});
  }
};

 /*Change Password */
exports.UserChangePassword = async (req, res) => {
  try {
 var users = req.session.user;
    const {password, newpassword, confirmpassword} = req.body;
    if (!password || !newpassword || !confirmpassword) {
      return res.send({status: 500, message: "All Field are required"});
    } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,14}$/.test(newpassword)) {
      return res.send({status: 500, message:" New Password Must contain at least one uppercase letter and one lowercase letter and number , and at least 8 or more characters"});
    } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,14}$/.test(confirmpassword)){
      return res.send({status: 500,message:" Confirm Password Must contain at least one uppercase letter and one lowercase letter and number , and at least 8 or more characters"});
    } else if (newpassword !== confirmpassword) {
      return res.send({status: 500,message: "New Password and confirmpassword not Matches !"});
    } 
   
   
    if (users) {
      var old_Password = req.body.password;
      var new_password = req.body.newpassword;
      var confirm_password = req.body.confirmpassword;
      await User.findOne({email: req.session.user.email}).exec(
        (error, data) => {
          if (error) throw console.error();
          if(data.google_id){
          return res.send({status: 500,message: "You are SignUp in google....! You Can't Change Password...!!!!! "});
         }
          var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            data.password
          );
         if (!passwordIsValid) {
           return res.send({ status: 500,message: "Invalid password...! Please enter correct Password.", })
          } else {
          if (new_password != confirm_password) {
          return res.send({ status: 500, message: "New Password and confirmpassword not Matches !"});
          } else {
           var saltRound = 10;
            bcrypt.hashSync(req.body.password, saltRound)
            data.password = new_password;
             data.save((error, data) => {
                if (error) {
                  console.log(error);
                } else {
                  return res.send({
                    status: 200,
                    message: "Your Password have be change successfully.",
                  });
                }
                });
            }
          }
        }
      );
    } else {
     return res.send({status: 400, message: "You are not login"});
    }
  } catch (error) {
    res.status(500).json({msg: error});
  }
};

/*Forgot Password */
exports.forgot_password = function (req, res, next) {
  async.waterfall(
    [
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString("hex");
          done(err, token);
        });
      },
      function (token, done) {
        User.findOne({email: req.body.email}, function (err, user) {
          if (!user) {
            req.flash("error", "No account with that email address exists.");
            return res.redirect("/forgot");
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function (err) {
            done(err, token, user);
          });
        });
      },
      function (token, user, done) {
        var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); 
        sendSmtpEmail = {
          sender: { email: "noreply@easeaccount.in" },
          to: [
            {
              email: user.email,
              name: user.firstName +user.lastName,
            },
          ],
          subject: "Reset Your Password",
          htmlContent:'<div style="max-width:640px;margin:0 auto;box-shadow:0px 1px 5px rgba(0,0,0,0.1);border-radius:4px;overflow:hidden"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#396cf0 url(https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png) top center / cover no-repeat;" align="center" border="0" background="https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png"><tbody><tr>'+
              '<td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:57px;"> <div style="cursor:auto;color:white;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:36px;font-weight:600;line-height:36px;text-align:center;">Welcome Doctor Appointment Booking System</div></td></tr></tbody></table><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#ffffff;" align="center" border="0"> <tbody>'+
              '<tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 70px;"><div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody> <tr> <td style="word-break:break-word;font-size:0px;padding:0px 0px 20px;" align="left"><div style="cursor:auto;color:#737F8D;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:16px;line-height:24px;text-align:left;"><h2 style="font-family: Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-weight: 500;font-size: 20px;color: #4F545C;letter-spacing: 0.27px;">'+user.firstName+' '+user.lastName+',</h2><p>You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
              'Please click on the following link, or paste this into your browser to complete the process</p></div></td> </tr>'+
              '<tr><td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:separate;" align="center" border="0"><tbody><tr><td style="border:none;border-radius:3px;color:white;cursor:auto;padding:15px 19px;" align="center" valign="middle" bgcolor="#396cf0">'+
              '<a href="http://easeaccount.in'+
              "/resertPassword/"+
              user._id+
              '"style="text-decoration:none;line-height:100%;background:#396cf0;color:white;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:15px;font-weight:normal;text-transform:none;margin:0px;">Verify Email</a></td></tr></tbody></table> </td></tr></tbody></table></div></td> </tr></tbody></table></div>'


          // '<p>'+user.firstName+' '+user.lastName+'You are receiving this because you (or someone else) have requested the reset of the password for your account <a href="http://' +
          //         req.headers.host +
          //         "/resertPassword/"+
          //         user._id+
          //         '\n\n">Reset Password</a> Thanks to regarding Doctor Appointment Booking System</p>',
        };
        apiInstance.sendTransacEmail(sendSmtpEmail).then(
          function (data) {
            console.log("API called successfully. Returned data: " + data);
            console.log(JSON.stringify(data));
          },
          function (error) {
             done(error, "done");
            console.error(error);
          });
      },
    ],
    function (err) {
      if (err) console.log(err);
      return next(err);
      res.status(400).json({error: err});
    }
  )};

 /*Reset Password Data */
exports.reset_password_data = function (req, res, next) {
  console.log(req.body);
  var new_password = req.body.password;
  var confirm_password = req.body.confirm;
    if (!new_password || !confirm_password) {
      return res.send({status: 200, message: "All Field are required"});
    } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,14}$/.test(new_password)) {
      return res.render("resertPassword", {
      new_password: req.body.new_password,
      error_password:"Must contain at least one uppercase letter and one lowercase letter and number , and at least 8 or more characters"})
    } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,14}$/.test(confirm_password)){
       return res.render("resertPassword", {
         confirm_password: req.body.confirm_password,
        error_passwordData: "Must contain at least one uppercase letter and one lowercase letter and number , and at least 8 or more characters" })
    }

  async.waterfall(
    [
      function (done) {
        User.findOne(
          {_id: req.body._id, resetPasswordExpires: {$gt: Date.now()}},
          function (error, user) {
            console.log(error);
            console.log(user);
            if (!user) {
              req.flash(
                "error",
                "Password reset token is invalid or has expired."
              );
              return res.redirect("back");
            }
            if (new_password != confirm_password) {
               return res.render("resertPassword", { error_confirm: "New Password and confirmpassword not Matches !" })
            } else {
              var saltRound = 10;
              bcrypt.hashSync(req.body.password, saltRound)
              user.password = new_password;
              user.save((error, data) => {
              if (error) {
                console.log(error);
              } else {
                res.render("login", { success: true, message: "your Password update Successfully",});
              }
              });
            }
          }
        );
      },
      function (user, done) {

       var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); 
        sendSmtpEmail = {
          sender: { email: "noreply@easeaccount.in" },
          to: [
            {
              email: user.email,
              name: user.firstName +user.lastName,
            },
          ],
          subject: "Your Password has been changed",
          htmlContent: " Hello,\n\n" +
             user.firstName +" " +user.lastName+
            "This is a confirmation that the password for your account " +
            user.email+
            " has just been changed.\n",
        };
        apiInstance.sendTransacEmail(sendSmtpEmail).then(
          function (data) {
             req.flash("success", "Success! Your password has been changed.");
            console.log("API called successfully. Returned data: " + data);
            console.log(JSON.stringify(data));
          },
          function (error) {
             done(error, "done");
            console.error(error);
          });
      },
    ],
    function (err) {
      res.redirect("/api/signin");
    }
  );
};

 /* Doctor Account Deleted*/
exports.UserDelete = async (req, res, next) => {
  try {
    var users = req.session.user;
    var idDta = req.params.id
    // console.log(req.params);
    if (users) {
      await User.findByIdAndRemove(idDta).exec(
        (error, data) => {
          if (error) throw console.error();
          // console.log(data);
          res.send({ status:200,message:"Your Account was deleted successfully!" });
          // res.render("index", {});
        });
    } else {
      res.send({status:200,message: "Could not delete your Account "});
    }
  } catch (error) {
    res.status(500).json({msg: error});
  }
};

exports.doctorAppointmenBook = async(req,res)=>{
  try {
    const {patientName ,contactNumber} = req.body;
     if (!/^[a-zA-Z. ]+$/.test(patientName)) {
      return res.send({status: 500,message: "First Name Must be contain Latter"});
    }else if (!/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/i.test(contactNumber)) {
      return res.send({status: 500, message: "Must contain at least  number 10 digit"})
   }
    let userData = req.body.patientId;
    let department = req.body.departmentId;
    let splitData = department.split("#");
    let departmentId = splitData[0];
    let departmentName = splitData[1];
    let doctor = req.body.doctorId;
    let splitDatas = doctor.split("#");
    let doctorId = splitDatas[0];
    let fullName = splitDatas[1];

    const users = new Patient({
      patientName: req.body.patientName,
      email: req.body.email,
      contactNumber: req.body.contactNumber,
      address: req.body.address,
      age: req.body.age,
      gender: req.body.gender,
      date:req.body.date,
      Comment: req.body.Comment,
      doctorId: doctorId,
      fullNameDoctor: fullName,
      departmentId: departmentId,
      departmentName:departmentName.charAt(0).toUpperCase() + departmentName.slice(1),
      userId:userData,
    });
    users.save((error, user) => {
      if (error) {
        return res.send({status: 500, message:error });
      } else {
        var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); 
        sendSmtpEmail = {
          sender: { email: "noreply@easeaccount.in" },
          to: [
            {
              email: user.email,
              name: user.firstName +user.lastName,
            },
          ],
          subject: " Your Appointment is Book ![Clinic Appointment]",
          textContent: '<div style="max-width:640px;margin:0 auto;box-shadow:0px 1px 5px rgba(0,0,0,0.1);border-radius:4px;overflow:hidden"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#396cf0 url(https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png) top center / cover no-repeat;" align="center" border="0" background="https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png"><tbody><tr>'+
                        '<td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:57px;"> <div style="cursor:auto;color:white;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:36px;font-weight:600;line-height:36px;text-align:center;">Welcome Doctor Appointment Booking System</div></td></tr></tbody></table><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#ffffff;" align="center" border="0"> <tbody>'+
                        '<tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 70px;"><div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody> <tr> <td style="word-break:break-word;font-size:0px;padding:0px 0px 20px;" align="left"><div style="cursor:auto;color:#737F8D;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:16px;line-height:24px;text-align:left;"><h2 style="font-family: Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-weight: 500;font-size: 20px;color: #4F545C;letter-spacing: 0.27px;">'+user.patientName+',</h2><h3>Patient Name = '+user.patientName+'</h3><h3> Date = '+user.date+'</h3><h3> Doctor Name = '+user.fullNameDoctor+'</h3><h3> Department Name = '+user.departmentName+'</h3></div></td></tr>'+
                        '<tr><td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:separate;" align="center" border="0"><tbody><tr><td style="border:none;border-radius:3px;color:white;cursor:auto;padding:15px 19px;" align="center" valign="middle" bgcolor="#396cf0">'+
                        '<h2 style="text-decoration:none;line-height:100%;background:#396cf0;color:white;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:15px;font-weight:normal;text-transform:none;margin:0px;"> Congratulations Your Appointment is Book</h2></td></tr></tbody></table> </td></tr></tbody></table></div></td> </tr></tbody></table></div>',
        };
        apiInstance.sendTransacEmail(sendSmtpEmail).then(
          function (data) {
            console.log("API called successfully. Returned data: " + data);
            console.log(JSON.stringify(data));
          },
          function (error) {
            console.error(error);
          });
        return res.send({status: 200, message: "Your Appointment Book ...........!"});
        }
    });
  } catch (error) {
     res.status(500).json({msg: error});
  }
}

/*Accept Appointment Status */
exports.acceptAppointment = async (req, res) => {
  try {
    let statusData = { status: "1"};
    let id = req.params.id
    await Patient.findByIdAndUpdate(id, statusData, {
      useFindAndModify: false,
    }).exec((error, data) => {
      if (error) throw console.error();
      res.send({status: 200, message: "Accept Appointment Successfully."});
    });
  } catch (error) {
    res.status(500).json({msg: console.log(error)});
  }
};
/*Cancle Appointment Status */
exports.cancelAppointment = async (req, res) => {
  try {
    let statusData = {status: "-1"};
    await Patient.findByIdAndUpdate({_id: req.params.id}, statusData, {
      useFindAndModify: false,
    }).exec((error, data) => {
      console.log(data);
      if (error) throw console.error();
      res.send({status: 200, message: "Cancel Appointment Successfully."});
    });
  } catch (error) {
    res.status(500).json({msg: console.log(error)});
  }
};

/*Doctor Active and Inactive Patients Review */
exports.patientsReviewActive = async (req, res, next) => {
  try {
    var users = req.session.user;
    // console.log(req.params);
    if (users) {
      let id = req.params.id 
      var statusData = {status: 0};
      var sts="Inactive"
      if(req.params.status==0 )
      {
        statusData = {status: 1};
        sts = 'Active'
      }
    await PatientReview.findByIdAndUpdate(id,statusData, {
      useFindAndModify: false,
    }).exec((error, data) => {
     
      if (error) throw console.error();
      res.send({status: 200, message:sts});
    });
    
    } else {
      res.status(500).send({status: 200 ,message: "Could not delete Patients Review "});
    }
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({msg: error});
  }
};

/*Doctor Delete Patients Review*/
exports.patientsReviewDelete = async (req, res, next) => {
  try {
    var users = req.session.user;
    if (users) {
      let id = req.params.id 
      console.log(id);
    await PatientReview.findByIdAndRemove(id, {
      useFindAndModify: false,
    }).exec((error, data) => {
      if (error) throw console.error();
      console.log(data);
      res.send({status: 200, message: "Delete Review Successfully."});
    });
    } else {
      res.status(500).send({status: 200 ,message: "Could not delete Patients Review "});
    }
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({msg: error});
  }
};

/*Doctor Time Table Set */
exports.DateTime = async (req, res, next) => {
  try {
    var users = req.session.user;
    if (users) {
      let dataDay = {
        Monday: req.body.Monday,
        Tuesday: req.body.Tuesday,
        Wednesday: req.body.Wednesday,
        Thursday: req.body.Thursday,
        Friday: req.body.Friday,
        Saturday: req.body.Saturday,
        Sunday: req.body.Sunday,
      };
      await User.findByIdAndUpdate({_id: users._id}, dataDay).exec(
        (error, data) => {
          if (error) throw console.error();
          res.send({status: 200, message: "Your Data Update successfully!"});
        }
      );
    } else {
      res.status(500).send({message: "Could not Found Date Account "});
    }
  } catch (error) {
    res.status(500).json({msg: error});
  }
};

/*Doctor Patient Appointment Time Schedule */
exports.patientScheduleTiming = async (req, res) => {
  try {
    let data = req.session.user;
    await Patient.find({doctorId: data._id})
      .exec((error, data) => {
        if (error) {
          res.status(404).json({error});
        } else {
          var  patientData = []
          data.forEach((element) => {
            var tempData = {};
            tempData["title"] = `${element.patientName} - ${element.time}`;
            tempData["start"] = element.date;
            patientData.push(tempData);
          });
          res.send(patientData);
        }
      });
  } catch (error) {
    res.status(500).json({error});
  }
};

/*Doctor listing in Department wise*/
exports.doctorlist = async (req, res) => {
  try {
    let dataDep = req.params.did;
    User.find({departmentId: dataDep, role: "doctor"}, function (error, doc) {
      if (error) {
        console.log(error);
      } else {
        res.send([doc]);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({msg: error});
  }
};

/*Country and State Selected  */
exports.statelist = async (req, res) => {
  try {
    let dataDep = req.params.did;
    States.find({countryCode:dataDep,}, function (error, doc) {
      if (error) {
        console.log(error);
      } else {
        var tempArray =[]
        for (let j = 0; j < doc.length; j++) {
            let dataState = doc[j].state
             for (let k = 0; k < dataState.length; k++) {
               if(dataState[k].countryCode === dataDep){
                 var tempData ={}
                tempData["state"] =dataState[k];
                 tempArray.push(tempData)
               }
             }
        }
        res.send(tempArray);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({msg: error});
  }
};

 /* Department  Insert*/
exports.department = async (req, res) => {
  try {

    if (req.file) {
    var users = new Department({
      departmentName: req.body.departmentName,
      icon:req.file.filename,
      texData:req.body.texData,

    });
    }
    users.save((error, user) => {
      if (error) {
        console.log(error);
      } else {
        // req.session = req.body;
        res.send({
          status: 200,
          message: "Department Insert Successfully.",
          user: req.session,
        });
      }
    });
  } catch (error) {
    res.status(500).json({msg: error});
  }
};

 /* Department  Edit*/
exports.departmentEdit = async (req, res) => {
  try {
    var departments = req.body.departmentId
    var splitDatas = departments.split("#");
    let departmentIds = splitDatas[0];
    let departmentName = splitDatas[1];
    console.log(departmentIds,departmentName ,"hello");
    // Podiatrists;
    if(req.file){
    var department = {
      departmentName: req.body.departmentName,
      icon:req.file.filename,
      texData:req.body.texData,
    };
  }
    await Department.findByIdAndUpdate(departmentIds, department, {
      useFindAndModify: false,
    }).exec((error, data) => {
      if (error) throw console.error();
      console.log(error);
      // console.log(data.departmentName + "! Depertment Updated Successfully");
      res.send({
        status: 200,
        message: "Depertment Updated Successfully.",
      });
    });
  } catch (error) {
    res.status(500).json({msg: error.stack});
  }
};

 /* Department  Delete*/
exports.departmentDelete = async (req, res, next) => {
  try {
    //  Homeopathy
     var departments = req.body.departmentId
    var splitDatas = departments.split("#");
   let departmentIds = splitDatas[0];
    let departmentName = splitDatas[1];
    console.log(departmentIds,departmentName ,"hello");
    if (departmentIds) {
      await Department.findByIdAndRemove({_id: departmentIds}).exec((error, data) => {
        if (error) throw console.error();
        res.send({
          success: 200,
          message: "Your Depertment was deleted successfully!",
        });
      });
    } else {
      res.status(500).send({message: "Could not delete your Account "});
    }
  } catch (error) {
    res.status(500).json({msg: error});
  }
};
// dataRole
exports.dataRole = async (req, res, next) => {
  req.session.user_role =  req.body.role
  console.log( req.body.role);
  res.send({status:200 ,message:"Successfully You role Selected",}) 
};

