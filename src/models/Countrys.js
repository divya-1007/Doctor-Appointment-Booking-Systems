const mogoose = require('mongoose');
const userSchema = new mogoose.Schema({
  isoCode: {
    type: String,
  },
  countryName: {
    type: String,
  },
  stateName:[{
    type: String,
  }],
   flag: {
    type: String,
  },
   currency: {
    type: String,
  },
   
}, { timestamps: true });


module.exports = mogoose.model('Country', userSchema);