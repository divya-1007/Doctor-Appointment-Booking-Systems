const {check, validationResult} = require("express-validator");

exports.isRequestValidated = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    return res.status(400).json({error: errors.array()[0].msg});
  }
  next();
};

exports.validateSign = (req, res, next) => {
  if (req.body == null) {
    return check("All Field are require");
  } else {
    const {firstName, lastName, email, contactNumber, password} = req.body;
    if (!firstName || !lastName || !email || !password || !contactNumber) {
      return res.render("signup", {
        error_data: "All Field are require",
      });
    } else if (!/^[a-zA-Z. ]+$/.test(firstName)) {
      return res.render("signup", {
        firstName: req.body.lastName,
        error_firstName: "First Name Must be contain Latter",
      });
    } else if (!/^[a-zA-Z. ]+$/.test(lastName)) {
      return res.render("signup", {
        lastName: req.body.lastName,
        error_lastName: "Last Name be Must be contain Latter",
      });
    } else if (!/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/i.test(contactNumber)) {
      return res.render("signup", {
        lastName: req.body.contactNumber,
        error_contactNumber: "Must contain at least  number 10 digit",
      });
    } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,14}$/.test(password)) {
      return res.render("signup", {
        password: req.body.password,
        error_password:
          "Must contain at least one uppercase letter and one lowercase letter and number , and at least 8 or more characters",
      });
    }
  }
  next();
};
exports.validateSignIn = (req, res, next) => {
  const {email, password} = req.body;
  if (!email || !password) {
     res.render("login", {
      error_data: "Please Enter Email & Password",
    });
  } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,14}$/.test(password)) {
    res.render("login", {
      password: req.body.password,
      error_password:
        "Must contain at least one uppercase letter and one lowercase letter and number , and at least 8 or more characters",
    });
  }
  next();
};

exports.DoctorChangePassword = (req, res, next) => {
  const {
    patientName,
    email,
    contactNumber,
    address,
    age,
    date,
    gender,
    departmentId,
  } = req.body;
  if (
    !patientName ||
    !email ||
    !contactNumber ||
    !address ||
    !age ||
    !date ||
    !gender ||
    !departmentId
  ) {
    return res.render("appointmentBook", {
      error_data: "All Field are require",
    });
  } else if (!/^[a-zA-Z. ]+$/.test(patientName)) {
    return res.render("appointmentBook", {
      firstName: req.body.patientName,
      error_firstName: "First Name Must be contain Latter",
    });
  } else if (!/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/i.test(contactNumber)) {
    return res.render("appointmentBook", {
      lastName: req.body.contactNumber,
      error_contactNumber: "Must be contain at least  number 10 digit",
    });
  }
  next();
};


