const {container}=require('googleapis/build/src/apis/container');
const mogoose = require('mongoose');
const userSchema = new mogoose.Schema({
    departmentName: {
    type: String,
    required: true,
    trim: true,
    min: 3,
    max: 20
  },
  icon:{
    type: String,
    required: true,
  },
  texData:{
    type: String,
    required: true,
  }
}, { timestamps: true });


module.exports = mogoose.model('Department', userSchema);