require('dotenv').config();
const express = require('express');
const env = require('dotenv');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const hbs = require('hbs')
var flash = require('express-flash');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var session = require('express-session');
var passport = require('passport');
const serverSideRoutes = require('./src/routes/serverSideRoutes');
const DoctorRoutes = require('./src/routes/DoctorRoutes'); 
const AdminRoutes = require("./src/routes/AdminRoutes");
const PatientRoutes = require("./src/routes/PatientRoutes")
const redis = require('redis');
let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient();
const assert = require('assert').strict;
const exphbs = require("express-handlebars");
var helpers = require("./src/config/hbshelper");
const User = require("./src/models/User");
const facebookStrategy = require('passport-facebook').Strategy


/*Call environment variables or contants */

/*Database connection */
mongoose.connect( process.env.MONGO_DB_DATABASE_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connection Successfull");
  })
  .catch((error) => {
    console.log(error);
  });

/* Middleware */
/* Parse application/x-www-form-urlencoded */
app.use(bodyParser.urlencoded({extended: true}));
/* Parse application/json */
app.use(bodyParser.json());
app.use(cors());
app.use(favicon());
app.use(logger("dev"));
app.use(cookieParser());
// store session state in browser cookie
app.use(
  cookieSession({
    name: "session",
    keys: ["x", "y"],
  })
);

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    store: new RedisStore({
      host: "redis",
      port: 6379,
      client: redisClient,
      ttl: 24 * 60 * 60,
    }),
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(flash());
// parsing the incoming data
app.use(express.json());
//serving public file
app.use(express.static("public"));
app.use(express.static("uploads"));

/* template engine */

app.set("view engine", "hbs", "exphbs");
app.set("views", "views");
hbs.registerPartials("views/partials");
hbs.registerPartials("views/adminPartials");

/* New Route to the TinyMCE Node module */
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

hbs.registerHelper("eq", function (value, options) {
  if (value == 1) {
    return "<td class ='p-3 btn-soft-success'>Accept Appointment</td>";
  } else if (value == -1) {
    return "<td class ='p-3 btn-soft-danger'>Cancle Appointment</td>";
  } else {
    return "<td class ='p-3 btn-soft-warning'>Not Accept Appointment</td>";
  }
});
hbs.registerHelper("ifElse", function (value, options) {
  if (value == 5) {
    return "<li class='list-inline-item'><i class='mdi mdi-star text-warning'></i></li><li class='list-inline-item'><i class='mdi mdi-star text-warning'></i></li><li class='list-inline-item'><i class='mdi mdi-star text-warning'></i></li><li class='list-inline-item'><i class='mdi mdi-star text-warning'></i></li><li class='list-inline-item'><i class='mdi mdi-star text-warning'></i></li>";
  } else if (value == 4) {
    return "<li class='list-inline-item'><i class='mdi mdi-star text-warning'></i></li><li class='list-inline-item'><i class='mdi mdi-star text-warning'></i></li><li class='list-inline-item'><i class='mdi mdi-star text-warning'></i></li><li class='list-inline-item'><i class='mdi mdi-star text-warning'></i></li>";
  } else if (value == 3) {
    return "<li class='list-inline-item'><i class='mdi mdi-star text-warning'></i></li><li class='list-inline-item'><i class='mdi mdi-star text-warning'></i></li><li class='list-inline-item'><i class='mdi mdi-star text-warning'></i></li>";
  } else if (value == 2) {
    return "<li class='list-inline-item'><i class='mdi mdi-star text-warning'></i></li><li class='list-inline-item'><i class='mdi mdi-star text-warning'></i></li>";
  } else {
    return "<li class='list-inline-item'><i class='mdi mdi-star text-warning'></i></li>";
  }
});

hbs.registerHelper("eql", function (value, options) {
  if (value == 1) {
    return "<td class ='p-3 btn-soft-success'>Active </td>";
  } else if (value == -1) {
    return "<td class ='p-3 btn-soft-danger'>Deactive </td>";
  } else if (value == 0){
    return "<td class ='p-3 btn-soft-warning'>Inactive </td>";
  }
});

hbs.registerHelper("prettifyDate", function (timestamp) {
  var data = new Date(timestamp);
  if (timestamp !== undefined) {
    var curr_date = data.getDate();
    var curr_month = data.getMonth();
    curr_month++;
    var curr_year = data.getFullYear();

    result = curr_year + "-0" + curr_month + "-" + curr_date;
    return result;
  }
});

/*Router */
app.use("/api", serverSideRoutes);
app.use("/", DoctorRoutes);
app.use("/", AdminRoutes);
app.use("/", PatientRoutes);


/* Facebook Sign In */ 
// passport.use(new facebookStrategy({
//   clientID:process.env.Facebook_CLIENT_ID,
//   clientSecret:process.env.Facebook_CLIENT_SECRET,
//   callbackURL:"http://localhost:8001/facebook/callback",
//   enableProof: true
// },
// async(token, refreshToken, public_profile, done)=> {
//   console.log(public_profile);
//  try {
// await User.findOne({ facebook_id: public_profile.id }, function(error, users) {
//   if(users){
//   // console.log(error.stack);
//   // }else if (users) {
//   return done(null, users);
// } else {
//    var nameData = public_profile.displayName
//   let splitData = nameData.split(" ")
//   var firstname = splitData[0]
//   var lastname = splitData[1]
//   var saltRound = 10;
//   var passwords = bcrypt.hashSync("Test123!@#", saltRound)
//   var newUser = new User({
//   facebook_id:public_profile.id,
//   firstName:firstname,
//   lastName:lastname,
//   password:passwords,
//   status: "1",
//   username: Math.random().toString(),
//   })
//   newUser.save((error ,user) => {
//     if (error)
//       throw error;
//     return done(null, user);
//   });
// } 
// })
//  }catch (error) {
//     console.log(error);
//   }
// }));

// app.get('/facebook', passport.authenticate('facebook', { scope : ['email','public_profile']}));
 
// app.get('/facebook/callback',
//   passport.authenticate('facebook', { successRedirect: '/dashboard', failureRedirect: '/SignIn' }));
/* Facebook Sign In End..... */ 

/* Server Start */
 module.exports = app.listen(process.env.PORT, () => {
    console.log(`Server is  🏃‍♂️  running on port ${process.env.PORT}`);
  });



// Test123!@#$%^&*() sendgrid password