require('dotenv').config();
const User = require("../models/User");
const Patient = require("../models/PatientbookAppointment");
const PatientReview = require("../models/patientReview");
const datacalender = require("../controller/calendarData");
const bcrypt = require("bcrypt");
var async = require("async");
var moment = require('moment');
const { Email, AVAILABLETEMPLATES } = require("../utils/emailService")
const {use}=require('chai');
const {google} = require('googleapis');
var SibApiV3Sdk = require('sib-api-v3-sdk');
var apiData = process.env.EMAIL_API_KEY
var defaultClient = SibApiV3Sdk.ApiClient.instance;
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = apiData
// const {status} = require("express/lib/response");
const CREDENTIALS ={
  "type": "service_account",
  "project_id": "sound-octagon-343808",
  "private_key_id": "c3d24727863290b26cb451eef6624469a06a0169",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDBPZeJ+AXjDyhO\nV9zD15kiKmYRi9WTK1d2TEwDavVd2dSQS7Y+07pWX88mBwAixv7shos9Nug87BFS\nppX8UKrihjSOIg7SgKJqAZjiP+ZNGa28Wvdu2wUum7AMU3jPQPKnbSnUMmJ0a40M\nwm7F4/i3lzvp7rJbrto9wtUXMKi4vtXxAAOLMnwD1GG0kTR8ZdbNNrKaS5aQXjt+\ncnbEkghqH3BbGsmgGn0NKSlzVJYzyjPVFDe7VBE0uer/KNEtpZ/3eS718BwVBnuY\nVUNw4cS6uKuCAskeubcp1TSyQHXtjxULpg79YNUj50vvSoQ5vxOHsWomelcEdb/N\n71AjFnNZAgMBAAECggEARjyJUnwEQ8HUIBmeY85+2eS4QaNmRv4nZZeYv1tGgMy2\njpX+UTqqzU84nzVHLtzOdpD2lhLZeZ9CMpzbAiEd44TtIEYvxgI8RjR7aazZG+f7\n9mzH55KTARxUcj56uDX+nK04WWjQ0UjwNRWMpr/UPIKrI71/NYTJzU3+HtYwVSlh\nwz/H3F6TSa24zl6AhWy3aWyRiF/wHHLE3s2ZJge2hozApS4jCRfCi+ZiVdE8cUBE\nkbtnfFXp/bI3nDsYWHYiEpntTuA3Ghf60qkUldlQmONQCT3FUmnDNeTEnJ727F+a\nF3k1jMY2E6SoSuYw5W2mXfxQPmneNC2ftI+J1yzuiwKBgQDvO4LCYj64NlWQax9q\nRa2senfZ/ZZJU6c/x+PTpZo4S5BJshgTCbbzM7ouy1KTjfsR9FoUquyUyuaHE++3\ns3M7E46K5hCSYVjpilzC1d2r+6ZdRGAjGTA6YrvzSMcNvwTQUdW31wxwQ++JEJyi\n/Gv8Ns8/orxdmbpPa9cPJUdh9wKBgQDOyNxAedXM5xmg/nsEdUlAkA6+2iIdnkRa\nEkc2fQs0ldZwf52FqLhY59R2ANpYd+ad1vKT/zBFABw1gL6WdwFVXnnTIXzDFRf+\neYG2btCBjKRXuXWiQ3isHeW771VQAhAtUWXOAcExgAxEa2P1X3OJ4iTaueJusC0S\n+oc5OtKBLwKBgCDT2LiVxKeAhTNBD9mEYDWXxJR8MMA1I3EkG8YyJjxtWgpSzuzl\n2136DiVXrygiRn6LOkU1wysTwJhuiul5TWmg4GF8+m8rvoilfN8be8SazpRjypFm\nZnDMlZ/nr7DaMm3nnN0SPFm3aMo1JllTK/o7BytjSFfLvX4ifStN4UK3AoGAexEX\n5FeeYuB3ZFWQKUsUWZRi8jsoarAyxdhzAX7SGG3Evhd1TILplCAFVmWTjWtumSnA\nHUyXEbnLEBybUTlqVcBwiLM5aXE4Yn82L7kr5q4pcPwzgmrderIgdAUwpPlVX2M+\nT6jDrg4jPuUbDIHOZZVtka9nj7DSYqUvrWPQvIkCgYBzvs57yrCh78A/f0P8YQkh\nU0vfjvQs1gJq+Lub07YPb5fHgK5nZES/HZK+n+Me+MjVpCKLgugelpXZf10s+f+f\nEKsHzBS6NAWYjHQLSeAgrccuW2v+aKaYF8XNee/RImdckLxLlV+NS8bnaOy8Nqfa\n38S8uBxSr8vYl8atZE6uVw==\n-----END PRIVATE KEY-----\n",
  "client_email": "appointment-schedule@sound-octagon-343808.iam.gserviceaccount.com",
  "client_id": "117476511829707471572",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/appointment-schedule%40sound-octagon-343808.iam.gserviceaccount.com"
}
const calendarId = "h8q3p0rjn3ps92ms55gh7tkf8g@group.calendar.google.com";
/* Google calendar API settings */
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version : "v3"});

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);

const insertEvent = async (event) => {

try {
    let response = await calendar.events.insert({
        auth: auth,
        calendarId: calendarId,
        resource: event
    });

    if (response['status'] == 200 && response['statusText'] === 'OK') {
        return 1;
    } else {
        return 0;
    }
} catch (error) {
    console.log(`Error at insertEvent --> ${error}`);
    return 0;
}
};


/*Patient Signup Clinic Appointment Book */
exports.clinicAppointment = async (req, res) => {
  try {
    User.findOne({email: req.body.email}).exec((error, user) => {
         
          var name = req.body.patientName;
          var splitData = name.split(" ");
          var patientFirst = splitData[0];
          var patientLast = splitData[1];
          var department = req.body.departmentId;
          var splitDatas = department.split("#");
          var departmentId = splitDatas[0];
          var departmentName = splitDatas[1];
          var doctor = req.body.doctorId;
          var splitDatas1 = doctor.split("#");
          var doctorId = splitDatas1[0];
          var fullName = splitDatas1[1];
      if (user == null) {
           pass = "Test123!@#";
           var saltRound = 10;
        bcrypt.hashSync(pass, saltRound)
            const users = new User({
              firstName: patientFirst,
              lastName: patientLast,
              email: req.body.email,
              role: "patient",
              departmentId: departmentId,
              departmentName: departmentName.charAt(0).toUpperCase() +departmentName.slice(1),
              date: req.body.date,
              contactNumber: req.body.contactNumber,
              doctorId: doctorId,
              fullNameDoctor: fullName,
              password: pass,
              username: Math.random().toString(),
            });
            users.save((error, user) => {
              if (error) {
                console.log(error);
              } else {
                console.log(user);
                let userid = user._id;
                const users = new Patient({
                  patientName: req.body.patientName,
                  email: req.body.email,
                  contactNumber: req.body.contactNumber,
                  address: req.body.address,
                  age: req.body.age,
                  date: req.body.date,
                  gender: req.body.gender,
                  Comment: req.body.Comment,
                  doctorId: doctorId,
                  fullNameDoctor: fullName,
                  userId: userid,
                  departmentId: departmentId,
                  departmentName:departmentName.charAt(0).toUpperCase() +departmentName.slice(1),
                });
                users.save(async(error, user) => {
                  if (error) {
                    console.log(error);
                }else{
                  // var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
                  // var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); 
                  // sendSmtpEmail = {
                  //   sender: { email: "noreply@easeaccount.in" },
                  //   to: [
                  //     {
                  //       email: user.email,
                  //       name: user.firstName +user.lastName,
                  //     },
                  //   ],
                  //   subject: " Your Appointment is Book ![Clinic Appointment]",
                  //   textContent: '<div style="max-width:640px;margin:0 auto;box-shadow:0px 1px 5px rgba(0,0,0,0.1);border-radius:4px;overflow:hidden"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#396cf0 url(https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png) top center / cover no-repeat;" align="center" border="0" background="https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png"><tbody><tr>'+
                  //                 '<td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:57px;"> <div style="cursor:auto;color:white;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:36px;font-weight:600;line-height:36px;text-align:center;">Welcome Doctor Appointment Booking System</div></td></tr></tbody></table><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#ffffff;" align="center" border="0"> <tbody>'+
                  //                 '<tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 70px;"><div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody> <tr> <td style="word-break:break-word;font-size:0px;padding:0px 0px 20px;" align="left"><div style="cursor:auto;color:#737F8D;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:16px;line-height:24px;text-align:left;"><h2 style="font-family: Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-weight: 500;font-size: 20px;color: #4F545C;letter-spacing: 0.27px;">'+user.patientName+',</h2><h3>Patient Name = '+user.patientName+'</h3><h3> Date = '+user.date+'</h3><h3> Doctor Name = '+user.fullNameDoctor+'</h3><h3> Department Name = '+user.departmentName+'</h3></div></td></tr>'+
                  //                 '<tr><td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:separate;" align="center" border="0"><tbody><tr><td style="border:none;border-radius:3px;color:white;cursor:auto;padding:15px 19px;" align="center" valign="middle" bgcolor="#396cf0">'+
                  //                 '<h2 style="text-decoration:none;line-height:100%;background:#396cf0;color:white;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:15px;font-weight:normal;text-transform:none;margin:0px;"> Congratulations Your Appointment is Book</h2></td></tr></tbody></table> </td></tr></tbody></table></div></td> </tr></tbody></table></div>',
                  // };
                  // apiInstance.sendTransacEmail(sendSmtpEmail).then(
                  //   function (data) {
                  //     console.log("API called successfully. Returned data: " + data);
                  //     console.log(JSON.stringify(data));
                  //   },
                  //   function (error) {
                  //     console.error(error);
                  //   }); 
                  //  return res.send({status: 200,message: "your Appointment Book ![Clinic Appointment]"});
                  const template = AVAILABLETEMPLATES.APP_CLINIC;
       
                    const templateEmail = user.email;
                    // Prepare the data you want to pass to the email template
                    const emailData = {
                      patientName:user.patientName,
                      date:user.date,
                      fullNameDoctor: user.firstName+" "+user.lastName,
                      departmentName:user.departmentName
                    };
                  
                    try {
                      // Send the email using the Email class
                      const emailResult = await Email.sendEmail(template, emailData,templateEmail);
                  
                      // Check if the email was sent successfully
                      if (emailResult.accepted.length > 0) {

                        console.log(`Email sent successfully to ${templateEmail}`);
                        return res.send({status: 200, message: " Your Appointment is Book ![Clinic Appointment]"});
                      } else {
                        console.error(`Failed to send email to ${ccEmails}`);
                      }
                    } catch (error) {
                      console.error(`Error sending email: ${error.message}`);
                    }
                    }
                });
              }
            });
      } else {
        let userid = user._id;

          const users = new Patient({
            patientName: req.body.patientName,
            email: req.body.email,
            contactNumber: req.body.contactNumber,
            address: req.body.address,
            age: req.body.age,
            date: req.body.date,
            gender: req.body.gender,
            Comment: req.body.Comment,
            doctorId: doctorId,
            fullNameDoctor: fullName,
            userId: userid,
            departmentId: departmentId,
            departmentName:
              departmentName.charAt(0).toUpperCase() + departmentName.slice(1),
          });
          
          users.save(async(error, user) => {
            if (error) {
              console.log(error);
            }else{
              //  var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
              //     var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); 
              //     sendSmtpEmail = {
              //       sender: { email: "noreply@easeaccount.in" },
              //       to: [
              //         {
              //           email: user.email,
              //           name: user.firstName +user.lastName,
              //         },
              //       ],
              //       subject: " Your Appointment is Book ![Clinic Appointment]",
              //       textContent:  '<div style="max-width:640px;margin:0 auto;box-shadow:0px 1px 5px rgba(0,0,0,0.1);border-radius:4px;overflow:hidden"><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#396cf0 url(https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png) top center / cover no-repeat;" align="center" border="0" background="https://cdn.discordapp.com/email_assets/f0a4cc6d7aaa7bdf2a3c15a193c6d224.png"><tbody><tr>'+
              //                     '<td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:57px;"> <div style="cursor:auto;color:white;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:36px;font-weight:600;line-height:36px;text-align:center;">Welcome Doctor Appointment Booking System</div></td></tr></tbody></table><table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#ffffff;" align="center" border="0"> <tbody>'+
              //                     '<tr><td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 70px;"><div aria-labelledby="mj-column-per-100" class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;"><table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"><tbody> <tr> <td style="word-break:break-word;font-size:0px;padding:0px 0px 20px;" align="left"><div style="cursor:auto;color:#737F8D;font-family:Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-size:16px;line-height:24px;text-align:left;"><h2 style="font-family: Whitney, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;font-weight: 500;font-size: 20px;color: #4F545C;letter-spacing: 0.27px;">'+user.patientName+',</h2><h4>Patient Name = '+user.patientName+'</h4><h4> Date = '+user.date+'</h4><h4> Doctor Name = '+user.fullNameDoctor+'</h4><h4> Department Name = '+user.departmentName+'</h4></div></td></tr>'+
              //                     '<tr><td style="word-break:break-word;font-size:0px;padding:10px 25px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:separate;" align="center" border="0"><tbody><tr><td style="border:none;border-radius:3px;color:white;cursor:auto;padding:15px 19px;" align="center" valign="middle" bgcolor="#396cf0">'+
              //                     '<h2 style="text-decoration:none;line-height:100%;background:#396cf0;color:white;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:15px;font-weight:normal;text-transform:none;margin:0px;"> Congratulations Your Appointment is Book</h2></td></tr></tbody></table> </td></tr></tbody></table></div></td> </tr></tbody></table></div>',
              //     };
              //     apiInstance.sendTransacEmail(sendSmtpEmail).then(
              //       function (data) {
              //         console.log("API called successfully. Returned data: " + data);
              //         console.log(JSON.stringify(data));
              //       },
              //       function (error) {
              //         console.error(error);
              //       }); 
              //  return res.send({status: 200,message: "your Appointment Book ![Clinic Appointment]"});

              const template = AVAILABLETEMPLATES.APP_CLINIC;
       
              const templateEmail = user.email;
              // Prepare the data you want to pass to the email template
              const emailData = {
                patientName:user.patientName,
                date:user.date,
                fullNameDoctor: user.firstName+" "+user.lastName,
                departmentName:user.departmentName
              };
            
              try {
                // Send the email using the Email class
                const emailResult = await Email.sendEmail(template, emailData,templateEmail);
            
                // Check if the email was sent successfully
                if (emailResult.accepted.length > 0) {

                  console.log(`Email sent successfully to ${templateEmail}`);
                  return res.send({status: 200, message: " Your Appointment is Book ![Clinic Appointment]"});
                } else {
                  console.error(`Failed to send email to ${ccEmails}`);
                }
              } catch (error) {
                console.error(`Error sending email: ${error.message}`);
              }   

            }
          });
      }
    });
  } catch (error) {
    res.status(500).json({msg: error});
  }
};
/* Patient Signup Online Appointment */
exports.online_appointment = async (req, res) => {
  try {
    let countryData = req.body.country
    let countryName =  countryData.split("#");
    var countryName0 = countryName[0];
    var countryName1 = countryName[1];
    var countryName2 = countryName[2];
    var gmtOffsetName = countryName2.split('UTC')
    var gmtOffsetName2 = gmtOffsetName[1];

    var name = req.body.patientName;
    var splitData = name.split(" ");
    var patientFirst = splitData[0];
    var patientLast = splitData[1];
    var department = req.body.departmentId;
    var splitDatas = department.split("#");
    var departmentData = splitDatas[0];
    var departmentName = splitDatas[1];
    var doctor = req.body.doctorId;
    var splitDatas1 = doctor.split("#");
    var doctorId = splitDatas1[0];
    var fullName = splitDatas1[1];

    User.findOne({email: req.body.email}).exec((error, user) => {
      if (user == null) {
          let pass = "Test123!@#";

           var saltRound = 10;
        bcrypt.hashSync(pass, saltRound)
            const users = new User({
              firstName: patientFirst,
              lastName: patientLast,
              email: req.body.email,
              role: "patient",
              departmentId: departmentData,
              departmentName:departmentName.charAt(0).toUpperCase() +departmentName.slice(1),
              date: req.body.date,
              contactNumber: req.body.contactNumber,
              doctorId: doctorId,
              fullNameDoctor: fullName,
              status:1,
              password: pass,
              username: Math.random().toString(),
            });
            users.save((error, user) => {
              if (error) {
                console.log(error);
              } else {
                let userid = user._id;

                const users = new Patient({
                  patientName: req.body.patientName,
                  email: req.body.email,
                  contactNumber: req.body.contactNumber,
                  address: req.body.address,
                  age: req.body.age,
                  gender: req.body.gender,
                  date: req.body.date,
                  time: req.body.time,
                  Comment: req.body.Comment,
                  doctorId: doctorId,
                  fullNameDoctor: fullName,
                  userId: userid,
                  departmentId: departmentData,
                  departmentName:departmentName.charAt(0).toUpperCase() + departmentName.slice(1),
                });
               
                users.save((error, user) => {
                  if (error) {
                    console.log(error);
                  } else {
                    let datas = user.time
                    let data =  datas.split(" ");
                    let datas1 = data[0];
                    let datas2 = data[1];
                    let datas21 = user.date;
                    var dt = moment(datas1+":00"+datas2, ["HHmmss A"]).format("HH:mm:ss");
                    let dateData = datas21+"T"+dt;
                    
                    if(datas2 === "PM"){
                       let event = {
                        'summary': `Appointment  Book ${user.patientName}`,
                        'description': `This is the description.`,
                        'start': {
                            'dateTime': dateData+"-06:30",
                            'timeZone':  countryName1
                        },
                        'end': {
                            'dateTime': dateData+"-06:30",
                            'timeZone': countryName1
                        }
                    };
                       insertEvent(event)
                    .then((res) => {
                        console.log(res ,"hello");
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                    return res.send({status: 200,message: "Your Appointment Book ![Online Appointment]"});
                    }else if(datas2 === "AM"){
                      let event = {
                        'summary': `Appointment  Book ${user.patientName}`,
                        'description': `This is the description.`,
                        'start': {
                            'dateTime': dateData+gmtOffsetName2,
                            'timeZone': countryName1
                        },
                        'end': {
                            'dateTime': dateData+gmtOffsetName2,
                            'timeZone': countryName1
                        }
                        
                    };
                     insertEvent(event)
                    .then((res) => {
                        console.log(res );
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                    req.session = req.body;
                    return res.send({status: 200,message: "Your Appointment Book ![Online Appointment]"});
                    }else{
                    res.send({status: 500,message: "Data Not Found"});
                    }
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
                    subject: " Your Appointment is Book ! [Online Appointment]",
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
                  }
                });
              }
            });
      } else {
        let userid = user._id;
              
          const users = new Patient({
            patientName: req.body.patientName,
            email: req.body.email,
            contactNumber: req.body.contactNumber,
            address: req.body.address,
            age: req.body.age,
            country: countryName0,
            gender: req.body.gender,
            date: req.body.date,
            time: req.body.time,
            Comment: req.body.Comment,
            departmentId: departmentData,
            departmentName: departmentName.charAt(0).toUpperCase() + departmentName.slice(1),
            doctorId: doctorId,
            fullNameDoctor: fullName,
            userId: userid,
          });
          users.save((error, user) => {
            if (error) {
              console.log(error.stack);
            } else {
              var attendeesEmails = [
              { 'email': 'divya.synetalsolutions@gmail.com' },
              ];
             let datas = user.time
              let data =  datas.split(" ");
              let datas1 = data[0];
              let datas2 = data[1];
              let datas21 = user.date;
             var dt = moment(datas1+":00"+datas2, ["HHmmss A"]).format("HH:mm:ss");
            let dateData = datas21+"T"+dt;
              
              if(datas2 === "PM"){
                  let event = {
                  'summary': `Appointment  Book ${user.patientName}`,
                  'description': `This is the description.`,
                  'start': {
                      'dateTime': dateData+gmtOffsetName2,
                      'timeZone':  countryName1
                  },
                  'end': {
                      'dateTime': dateData+gmtOffsetName2,
                      'timeZone': countryName1
                  }
              };
              insertEvent(event)
              .then((res) => {
                  console.log(res ,"hello");
              })
              .catch((err) => {
                  console.log(err);
              });
              return res.send({status: 200,message: "Your Appointment Book ![Online Appointment]"});
              }else if(datas2 === "AM"){
                let event = {
                  'summary': `Appointment  Book ${user.patientName}`,
                  'description': `This is the description.`,
                  'start': {
                            'dateTime': dateData+gmtOffsetName2,
                            'timeZone': countryName1
                        },
                        'end': {
                            'dateTime': dateData+gmtOffsetName2,
                            'timeZone': countryName1
                        }
              };
                insertEvent(event)
              .then((res) => {
                  console.log(res ,"hello");
              })
              .catch((err) => {
                  console.log(err);
              });
              res.send({status: 200,message: "Your Appointment Book ![Online Appointment]"});
              }else{
                res.send({status: 200,message: "Your Appointment Book ![Online Appointment]"});
              }

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
                    subject: " Your Appointment is Book ! [Online Appointment]",
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
            }
          })
      }
    });
  } catch (error) {
    res.status(500).json({msg: error});
  }
};

/*Patient Profile Update */
exports.patientProfileUpdate = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      age,
      birthday,
      address,
      gender,
      bloodGroup,
      contactNumber,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !age ||
      !birthday ||
      !address ||
      !gender ||
      !bloodGroup ||
      !contactNumber
    ) {
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
    } else if (!/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/i.test(contactNumber)) {
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

    var data = req.session.user;
    var id = data._id;
    var recodeData;
    if (data)
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
    await User.findByIdAndUpdate(id, recodeData, {
      useFindAndModify: false,
    }).exec((error, data) => {
      if (error) throw console.error();
      res.send({status: 200, message: "Profile Updated Successfully."});
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "data not found"});
  }
};

/*.Patient Change Password */
exports.patientChangePassword = async (req, res) => {
  try {
    var users = req.session.user;
    if (users) {
      var old_Password = req.body.password;
      var new_password = req.body.newpassword;
      var confirm_password = req.body.confirmpassword;
      await User.findOne({ email: req.session.user.email }).exec(
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
            }
            else {
              if (new_password !== confirm_password) {
                return res.send({
                  status: 500,
                  message: "New Password and confirmpassword not Matches !....",
                });
              } else {
                var saltRound = 10;
                bcrypt.hash(new_password, saltRound).then(function (new_password) {
                    data.password = new_password;
                    data.save((error, data) => {
                      if (error) {
                        console.log(error);
                      } else {
                       return res.send({
                         status: 200,
                         message: "Your Password Change successfully.....",
                       });
                        // res.redirect(307, "/api/doctorDashboard");
                      }
                    });
                  });
              }
            }
        }
      );
    } else {
      res.send({ status: 500, message: "You are not login....." });
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

/*.Patient Delete Account */
exports.patientDeleteAccount = async (req, res, next) => {
  try {
    var users = req.session.user;
    var idData = req.params.id
    if (users) {
      await User.findByIdAndRemove(idData).exec(
        (error, data) => {
          if (error) throw console.error();
             res.send({ status:200,message:"Your Account was deleted successfully!" });
        }
      );
    } else {
      res.status(500).send({ message: "Could not delete your Account " });
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

/*.Patient Review  */
exports.Patientreview = async (req, res) => {
 
  try {
       const {reaction, review, departmentId} = req.body;
        if (
          !reaction ||
          !review ||
          !departmentId 
        ) {
          return res.render("patientReviws", {
            error_data: "All Field are require",
          });
        }
    let dataDep = req.session.user;
    let patientId = dataDep._id
    let department = req.body.departmentId;
    let splitData = department.split("#");
    let departmentId1 = splitData[0];
    let departmentName = splitData[1];
    let doctor = req.body.doctorId;
    let splitDatas = doctor.split("#");
    let doctorId = splitDatas[0];
    let fullName = splitDatas[1];

     const users = new PatientReview({
       review: req.body.review,
       reaction: req.body.reaction,
       doctorId: doctorId,
       fullName: fullName,
       patientId: patientId,
       departmentId: departmentId1,
       departmentName:departmentName.charAt(0).toUpperCase() + departmentName.slice(1),
       appointmentId:req.body._id
     });
     console.log(users);
     users.save((error, user) => {
       if (error) {
         console.log(error);
       } else {
         res.send({status: 200, message: "Patient Review Successfully."});
       }
     });
  } catch (error) {
    console.log(error);
    res.status(500).json({msg: error});
  }
};


