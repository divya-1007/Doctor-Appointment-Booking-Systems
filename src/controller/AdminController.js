const User = require("../models/User");
const Patient = require("../models/PatientbookAppointment");
const ContactQuerymsg = require("../models/contactQuerymsg");
const bcrypt = require("bcrypt");
const Fsq = require("../models/Fsq");
const TermsAndConditions = require("../models/termsAndConditions");
const privacyAndPolicy = require("../models/privacyPolicy");
var SibApiV3Sdk = require('sib-api-v3-sdk');
var apiData = process.env.EMAIL_API_KEY
var defaultClient = SibApiV3Sdk.ApiClient.instance;
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = apiData

exports.AdminProfileUpdate = async(req,res)=>{
   try {
    var recodeData;
     const {firstName, lastName, age,gender,contactNumber ,address} = req.body;
    if (!firstName || !lastName || !age ||!gender  ||!contactNumber ||!address) {
      return res.send({status: 200, message: "All Field are required"});
    } else if (!/^[a-zA-Z. ]+$/.test(firstName)) {
      return res.send({
        status: 200,
        message: "First Name Must be contain Latter",
      });
    } else if (!/^[a-zA-Z. ]+$/.test(lastName)) {
      return res.send({
        status: 200,
        message: "Last Name be Must be contain Latter",
      });
    }else if (!/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/i.test(contactNumber)){
    return res.send({
      status: 200,
      message: "Must contain at least  number 10 digit",
    });
    }
    if (req.file) {
      recodeData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        address: req.body.address,
        gender: req.body.gender,
        contactNumber: req.body.contactNumber,
        bio: req.body.bio,
        profilePicture: req.file.filename,
      };
    } else {
      recodeData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        address: req.body.address,
        gender: req.body.gender,
        contactNumber: req.body.contactNumber,
        bio: req.body.bio,
      };
    }
    await User.findOneAndUpdate({_id: req.body._id}, recodeData, {
      useFindAndModify: false,
    }).exec((error, data) => {
      if (error) throw console.error();
      res.send({status: 200, message: "Profile Updated Successfully."});
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({msg:error});
  }

}

/*.Admin Add Doctor */
exports.adminAddDoctor = async (req, res) => {
  try {
    await User.findOne({email: req.body.email}).exec((error, user) => {
      if (user) return res.status(400).json({message: "User already exist."});
      if (user == null) {
        const {firstName, lastName, email, contactNumber, password} = req.body;
        var saltRound = 10;
        bcrypt.hashSync(req.body.password, saltRound)
          const users = new User({
            firstName,
            lastName,
            email,
            contactNumber,
            password,
            status:1,
            username: Math.random().toString(),
          });
          users.save((error, user) => {
            if (error) {
              console.log(error);
            } else {
              req.session = req.body;
                return res.send({
                status: 200,
                message: "Add Doctor Successfully........",
              });
            }
        });
      } else{
         return res.send({
          status: 200,
          message: "This email is registered previously!\n You need to login.......",
        });
      } 
    });
  } catch (error) {
    res.status(500).json({msg: error});
  }
};

/*.Admin Add Patient */
exports.adminAddPatient = async (req, res) => {
  try {

    var department = req.body.departmentId;
    var splitDatas = department.split("#");
    var departmentId = splitDatas[0];
    var departmentName = splitDatas[1];
    var doctor = req.body.doctorId;
    var splitDatas1 = doctor.split("#");
    var doctorId = splitDatas1[0];
    var fullName = splitDatas1[1];
    await User.findOne({email: req.body.email}).exec((error, user) => {
      if (user)  return res.send({  status: 200, message: "User already exist......"}); 
      if (user == null) {
        const {firstName, lastName, email, role, contactNumber, password} = req.body;
        var saltRound = 10;
         bcrypt.hashSync(req.body.password, saltRound)
          const users = new User({
            firstName,
            lastName,
            email,
            role,
            contactNumber,
            departmentId,
            departmentName,
            doctorId: doctorId,
            fullNameDoctor: fullName,
            password,
            status:1,
            username: Math.random().toString(),
          });
          users.save((error, user) => {
            if (error) {
              console.log(error);
            } else {
              req.session = req.body;
              return res.send({
                status: 200,
                message: "Add Patient Successfully......",
              });
            }
        });
      } else{
        return res.send({
          status: 200,
          message: "This email is registered previously!\n You need to login.......",
        });
      } 
    });
  } catch (error) {
    res.status(500).json({msg: error});
  }
};

/*.Admin Patient Update */
exports.adminPatientUpdate = async (req, res) => {
  try {
    var recodeData;
     const {firstName, lastName, age, birthday,gender,bloodGroup,contactNumber} = req.body;
    if (!firstName || !lastName || !age || !birthday ||!gender ||!bloodGroup ||!contactNumber) {
      return res.send({status: 200, message: "All Field are required"});
    } else if (!/^[a-zA-Z. ]+$/.test(firstName)) {
      return res.send({
        status: 200,
        message: "First Name Must be contain Latter",
      });
    } else if (!/^[a-zA-Z. ]+$/.test(lastName)) {
      return res.send({
        status: 200,
        message: "Last Name be Must be contain Latter",
      });
    }else if (!/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/i.test(contactNumber)){
    return res.send({
      status: 200,
      message: "Must contain at least  number 10 digit",
    });
    }else if(req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/png' && req.file.mimetype !== 'image/jpg'){
    return res.send({
      status: 500,
      message: "Please Upload Only image png ,jpg and jepg",
    });
}
    if (req.file) {
      recodeData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        birthday: req.body.birthday,
        address: req.body.address,
        gender: req.body.gender,
        bloodGroup: req.body.bloodGroup,
        contactNumber: req.body.contactNumber,
        bio: req.body.bio,
        profilePicture: req.file.filename,
      };
    } else {
      recodeData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        birthday: req.body.birthday,
        address: req.body.address,
        gender: req.body.gender,
        bloodGroup: req.body.bloodGroup,
        contactNumber: req.body.contactNumber,
        bio: req.body.bio,
      };
    }
    await User.findOneAndUpdate({_id: req.body._id}, recodeData, {
      useFindAndModify: false,
    }).exec((error, data) => {
      if (error) throw console.error();
      res.send({status: 200, message: "Profile Updated Successfully."});
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({msg:error});
  }
};

/*.Admin Doctor Update */
exports.adminDoctorUpdate = async(req ,res)=>{
// instagram ,facebook,linkedin,twitter
   try {
 let department = req.body.departmentId;
 const {firstName, lastName, qualification, contactNumber} = req.body;
if (!firstName || !lastName || !qualification || !department) {
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

var data = req.body;
var recodeData;
  if (data)
    if (req.file) {
      recodeData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        contactNumber: req.body.contactNumber,
        departmentId: departmentId,
        departmentName:
        departmentName.charAt(0).toUpperCase() + departmentName.slice(1),
        qualification: req.body.qualification,
        specialties: req.body.specialties,
        country: req.body.country,
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
        departmentName:
        departmentName.charAt(0).toUpperCase() + departmentName.slice(1),
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
        ProfessionalExperience: req.body.ProfessionalExperience,
        HospitalExperienceName: req.body.HospitalExperienceName,
        ExperienceDate: req.body.ExperienceDate,
        ExperienceTODate: req.body.ExperienceTODate,
      };
    }
    await User.findByIdAndUpdate(data._id, recodeData, {
      useFindAndModify: false,
    }).exec((error, data) => {;
      if (error) throw console.error();
      res.send({status: 200, message: "Profile Updated Successfully."});
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "data not found"});
  }
}

/*.Admin Password Change (Patient And Doctor)*/
exports.adminPasswordChange = async (req, res) => {
  try {
     const {password, newpassword, confirmpassword} = req.body;
    if (!password || !newpassword || !confirmpassword) {
      return res.send({status: 500, message: "All Field are required"});
    } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,14}$/.test(newpassword)) {
      return res.send({
        status: 500,
        message:
          "Must contain at least one uppercase letter and one lowercase letter and number , and at least 8 or more characters",
      });
    } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,14}$/.test(confirmpassword)){
      return res.send({
        status: 500,
        message:
          "Must contain at least one uppercase letter and one lowercase letter and number , and at least 8 or more characters",
      });
    } else if (newpassword !== confirmpassword) {
      return res.send({
        status: 500,
        message: "New Password and confirmpassword not Matches !",
      });
    }
    var old_Password = req.body.password;
    var new_password = req.body.newpassword;
    var confirm_password = req.body.confirmpassword;
    await User.findById({_id: req.body._id}).exec((error, data) => {
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
        }
        if (data.password == old_Password) {
         return res.send({
            status: 500,
            message:"Password not match! !",
          });
        } else {
          if (new_password !== confirm_password) {
             return res.send({
              status: 500,
              message: "New Password and confirmpassword not Matches !",
            });
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
    });
  } catch (error) {
    res.status(500).json({msg:error});
  }
};

/*.Admin Doctor Time Table Set */
exports.AdminDateTime = async (req, res, next) => {
  try {
    var users = req.body;
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
exports.adminAccountDelete = async (req, res, next) => {
  try {
    var idData =  req.body._id
    await User.findByIdAndRemove(idData).exec((error, data) => {
      if (error) throw console.error();
      res.send({ status:200,message:"Your Account was deleted successfully!" });
    });
  } catch (error) {
    res.status(500).json({msg: error});
  }
};

/*.Admin Appoiments Booking */
exports.AdminAppoiment = async(req,res)=>{
  try {
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
        return res.send({status: 500, message: error});
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
        req.session = req.body;
        return res.send({status: 200, message: "Your Appointment Book ...........!"});
        }
    });
  } catch (error) {
     res.status(500).json({msg: error});
  }
}
/*.Admin FAQs  */
exports.adminAddQuestions = async (req, res, next) => {
  try {
    if(!req.body.questionsType || !req.body.questions ||!req.body.answer){
       return res.send({status: 200, message: "All Field are required"});
    }
    const users = new Fsq({
      questionsType: req.body.questionsType,
      questions: req.body.questions,
      answer: req.body.answer,
    });
    users.save((error, user) => {
      if (error) {
        console.log(error);
      } else {
        res.send({status: 200, message: "Profile Updated Successfully."});
      }
    });
  } catch (error) {
    res.status(500).json({msg: error});
  }
};
/*.Admin Terms And Conditions */
exports.TermsAndConditions = async (req, res, next) => {
  try {
    if(!req.body.Introduction ||!req.body.UserAgreements ||!req.body.Restrictions){
       return res.send({status: 200, message: "Terms And Conditions Field are required"});
    }
    const users = {
      Introduction: req.body.Introduction,
      UserAgreements:req.body.UserAgreements,
      Restrictions:req.body.Restrictions,
    };
    await TermsAndConditions.findOneAndUpdate({_id: req.body._id}, users, {
      useFindAndModify: false,
    }).exec((error, data) => {
      if (error) throw console.error();
      res.send({
        status: 200,
        message: "Terms And Conditions Updated Successfully.",
      });
    });
  } catch (error) {
    res.status(500).json({msg: error});
  }
};
/*.Admin Policy And Policy */
exports.PolicyPolicy = async (req, res, next) => {
  try {
    console.log(req.body);
    if(!req.body.Overview ||!req.body.information ||!req.body.ProvidedVoluntarily){
       return res.send({status: 200, message: "Policy And Policy  Field are required"});
    }
    const users = {
      Overview: req.body.Overview,
      information:req.body.information,
      ProvidedVoluntarily:req.body.ProvidedVoluntarily
    };
    await privacyAndPolicy.findOneAndUpdate({_id: req.body._id}, users, {
      useFindAndModify: false,
    }).exec((error, data) => {
      if (error) throw console.error();
      res.send({
        status: 200,
        message: "Policy And Policy  Updated Successfully.",
      });
    });
  } catch (error) {
    res.status(500).json({msg: error});
  }
};
/*.Admin Graph Chart Represent (data making) */
exports.adminGraphChartRepresent = async (req, res) => {
  try {

    var referer = req.headers.referer;
    let data24 = referer.split("?")
      var responseData = data24[0]
      var responseData2 = data24[1]
      console.log(responseData);
    if(responseData2){
      let years = responseData2.split("=") 
      var yearData = years[1];
    }else if(responseData){
      let data46='year=2022';
      let years = data46.split("=") 
      var yearData = years[1];
    }
    
  await Patient.aggregate([{$project:{ name:"$gender", date: "$date"} },]).exec((error,data)=>{
     if (error) throw console.error()
       var dataGenderFemale =[0,0,0,0,0,0,0,0,0,0,0,0,0];
       var dataGenderMale = [0,0,0,0,0,0,0,0,0,0,0,0,0];
       var dataGenderChiled = [0,0,0,0,0,0,0,0,0,0,0,0,0];
     for (var i = 0; i < data.length; i++) {
        var d = data[i].date;
        var gender =  data[i].name;
        if(d){
        let splitData = d.split('-')
        var year = splitData[0]
        var month = splitData[1]
     
        if(year===yearData){
            switch(gender){
                case "Male":
                   switch(month){
                      case '01':
                            dataGenderMale[0]+=1;
                        break;
                        case '02':
                            dataGenderMale[1]+=1;
                        break;
                        case '03':
                          dataGenderMale[2]+=1;
                        break;
                        case '04':
                          dataGenderMale[3]+=1;
                        break;
                        case '05':
                          dataGenderMale[4]+=1;
                        break;
                        case '06':
                          dataGenderMale[5]+=1;
                        break;
                        case '07':
                          dataGenderMale[6]+=1;
                        break;
                        case '08':
                          dataGenderMale[7]+=1;
                        break;
                        case '09':
                          dataGenderMale[8]+=1;
                        break;
                        case '10':
                          dataGenderMale[9]+=1;
                        break;
                        case '11':
                          dataGenderMale[10]+=1;
                        break;
                        case '12':
                          dataGenderMale[11]+=1;
                        break;
                    }
                break;
                case "Female":
                 switch(month){
                      case '01':
                            dataGenderFemale[0]+=1;
                        break;
                        case '02':
                            dataGenderFemale[1]+=1;
                        break;
                        case '03':
                          dataGenderFemale[2]+=1;
                        break;
                        case '04':
                          dataGenderFemale[3]+=1;
                        break;
                        case '05':
                          dataGenderFemale[4]+=1;
                        break;
                        case '06':
                          dataGenderFemale[5]+=1;
                        break;
                        case '07':
                          dataGenderFemale[6]+=1;
                        break;
                        case '08':
                          dataGenderFemale[7]+=1;
                        break;
                        case '09':
                          dataGenderFemale[8]+=1;
                        break;
                        case '10':
                          dataGenderFemale[9]+=1;
                        break;
                        case '11':
                          dataGenderFemale[10]+=1;
                        break;
                        case '12':
                          dataGenderFemale[11]+=1;
                        break;
                    }
                  break;
                  case "Children":
                   switch(month){
                      case '01':
                            dataGenderChiled[0]+=1;
                        break;
                        case '02':
                            dataGenderChiled[1]+=1;
                        break;
                        case '03':
                          dataGenderChiled[2]+=1;
                        break;
                        case '04':
                          dataGenderChiled[3]+=1;
                        break;
                        case '05':
                          dataGenderChiled[4]+=1;
                        break;
                        case '06':
                          dataGenderChiled[5]+=1;
                        break;
                        case '07':
                          dataGenderChiled[6]+=1;
                        break;
                        case '08':
                          dataGenderChiled[7]+=1;
                        break;
                        case '09':
                          dataGenderChiled[8]+=1;
                        break;
                        case '10':
                          dataGenderChiled[9]+=1;
                        break;
                        case '11':
                          dataGenderChiled[10]+=1;
                        break;
                        case '12':
                          dataGenderChiled[11]+=1;
                        break;
                    }
                    break;
                    default:
                      console.log('Default entered');
                      break;
        }}
      }else{

      }
  }
  res.send({dataGenderFemale ,dataGenderMale ,dataGenderChiled})
   })
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({error});
  }
};

exports.ContactQueryMsg = async (req, res, next) => {
 try {
    await User.find({role:"admin"}).exec((error,user)=>{
     if (error) throw console.error();
        for(var i=0 ;i<user.length;i++){
        var DataId = user[i]._id
        var emailData = user[i].email
        var nameData = user[i].firstName +""+user[i].lastName
         const users = new ContactQuerymsg({
          name:req.body.name,
          email:req.body.email,
          subject:req.body.subject,
          commentContactus:req.body.commentContactus,
          adminId:DataId
    });
    users.save((error, data) => {
      if (error) {
        console.log(error);
      } else {
        console.log(data);
         var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); 
        sendSmtpEmail = {
          sender: { email: "noreply@easeaccount.in" },
          to: [
            {
              email:emailData,
              name: nameData,
            },
          ],
          subject: " Your Appointment is Book ![Clinic Appointment]",
          textContent: '<div style="max-width:640px;margin:0 auto;box-shadow:0px 1px 5px rgba(0,0,0,0.1);border-radius:4px;overflow:hidden"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#396cf0 url(https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png) top center / cover no-repeat;" align="center" border="0" background="https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png"><tbody><tr>'+
                        '<td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:57px;"> <div style="cursor:auto;color:white;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:36px;font-weight:600;line-height:36px;text-align:center;">Welcome Doctor Appointment Booking System</div></td></tr></tbody></table><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#ffffff;" align="center" border="0"> <tbody>'+
                        '<tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 70px;"><div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody> <tr> <td style="word-break:break-word;font-size:0px;padding:0px 0px 20px;" align="left"><div style="cursor:auto;color:#737F8D;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:16px;line-height:24px;text-align:left;"><h2 style="font-family: Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-weight: 500;font-size: 20px;color: #4F545C;letter-spacing: 0.27px;">'+data.name+',</h2><h3>Name = '+data.name+'</h3><h3> email = '+data.email+'</h3><h3> Subject = '+data.subject+'</h3><h3> Comment Message  = '+data.commentContactus+'</h3></div></td></tr>'+
                        '</tbody></table> </td></tr></tbody></table></div></td> </tr></tbody></table></div>',
        };
        apiInstance.sendTransacEmail(sendSmtpEmail).then(
          function (data) {
            console.log("API called successfully. Returned data: " + data);
            console.log(JSON.stringify(data));
          },
          function (error) {
            console.error(error);
          });
           res.send({status: 200, message: "Your Query is Successfully Send."});
      }
    })
  }
  })
  } catch (error) {
    res.status(500).json({msg: error});
  }
};