const express = require("express");
const {UserSignup,UserSignin,UserUpdate, UserDelete, forgot_password,reset_password_data,UserChangePassword, department,acceptAppointment,cancelAppointment,
       departmentEdit,departmentDelete,DateTime,patientScheduleTiming,doctorlist,statelist ,patientsReviewActive,patientsReviewDelete ,dataRole,
       signupVarification,doctorAppointmenBook} = require("../controller/UserController");

const { clinicAppointment,online_appointment,patientProfileUpdate, patientChangePassword, 
        patientDeleteAccount,Patientreview,} = require("../controller/PatientController");

const {adminPatientUpdate,adminAccountDelete,adminPasswordChange,  adminAddQuestions,TermsAndConditions,adminAddDoctor,adminAddPatient,
      adminDoctorUpdate,AdminAppoiment,AdminDateTime,adminGraphChartRepresent,ContactQueryMsg,AdminProfileUpdate,PolicyPolicy} = require("../controller/AdminController");

const {validateSign,validateSignIn,DoctorChangePassword, isRequestValidated,} = require("../validators/authValidators");
const { authsJwt,adminMiddleware,patientMiddleware,} = require("../middleware/authJwt");
const upload = require("../../multer.config");
const ParseData = require("../middleware/ParseData");
const {reset} = require("nodemon");
const {json} = require("body-parser");
const router = express.Router();


router.post("/signup", isRequestValidated,  UserSignup);
router.post("/signin", isRequestValidated , UserSignin);
router.post("/user-update", upload.single("profilePicture"),authsJwt, UserUpdate);
router.post("/change-password", authsJwt, UserChangePassword);
router.post("/forgotpassword", forgot_password);
router.post("/resetpassword", reset_password_data);
router.get("/delete-account/:id", authsJwt, UserDelete);
router.post("/date-time", authsJwt, DateTime);
router.get("/doctorlist/:did", doctorlist);
router.get("/statelist/:did", statelist)
router.get("/accept-appointment/:id", authsJwt, acceptAppointment);
router.get("/cancel-appointment/:id", authsJwt, cancelAppointment);
router.get("/doctorScheduleData", patientScheduleTiming);
router.get("/doctor-ratients-reviewaccept/:id/:status", authsJwt,patientsReviewActive)
router.get("/doctor-patients-reviewdelete/:id", authsJwt,patientsReviewDelete)
router.post("/signupvarification", signupVarification);
router.post("/doctor-appointmen-book",authsJwt, doctorAppointmenBook);


/* Patient API details */
router.post("/clinic-appointment",isRequestValidated, DoctorChangePassword,clinicAppointment);
router.post( "/online-appointment",isRequestValidated, DoctorChangePassword,online_appointment);
router.post("/patient-profile-update", upload.single("profilePicture"),authsJwt,patientProfileUpdate);
router.post("/patient-change-password",authsJwt,patientMiddleware, patientChangePassword);
router.get("/Patient-delete-account/:id",authsJwt,patientMiddleware, patientDeleteAccount);
router.post("/patient-review", authsJwt, patientMiddleware, Patientreview);


/* Admin API details */
router.post("/admin-profile-update", authsJwt,adminMiddleware, AdminProfileUpdate);
router.post("/adminAddDoctor", authsJwt, adminMiddleware,isRequestValidated, validateSign,adminAddDoctor);
router.post("/adminAddPatient",authsJwt, adminMiddleware,isRequestValidated, validateSign, adminAddPatient);
router.post("/admin-patient-update",upload.single("profilePicture"),authsJwt, adminMiddleware,adminPatientUpdate);
router.post("/admin-doctor-update",upload.single("profilePicture"),authsJwt,adminMiddleware ,adminDoctorUpdate);
router.post("/admin-patient-password-change",authsJwt,adminMiddleware,adminPasswordChange);
router.post("/admin-patient-account-delete", authsJwt,adminMiddleware, adminAccountDelete);
router.post( "/admin-adminAddQuestions", authsJwt, adminMiddleware,adminAddQuestions);
router.post("/admin-termsAndConditions", authsJwt,  adminMiddleware,  TermsAndConditions);
router.post("/admin-Policy-Policy", authsJwt,  adminMiddleware,  PolicyPolicy);
router.post( "/adminAppoiment" ,AdminAppoiment);
router.post("/admin-date-time", authsJwt,adminMiddleware, AdminDateTime);
router.get("/admin-appoiment-gender", adminGraphChartRepresent);
router.post("/contatus-query-msg", ContactQueryMsg);


/* Department API details */
router.post("/department", upload.single("icon"), department);
router.post("/departmentEdit",upload.single("icon"), departmentEdit);
router.post("/department-delete", departmentDelete);
router.post('/role', dataRole );
// router.post.('/countryInsert')

module.exports = router;
// Synetal@123