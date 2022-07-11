const mogoose = require('mongoose');
const userSchema = new mogoose.Schema({
country:[{
    isoCode: {
    type: String,
  },
   name: {
    type: String,
  },
   phonecode: {
    type: String,
  },
   flag: {
    type: String,
  },
   currency: {
    type: String,
  },
   latitude: {
    type: String,
  },
   longitude: {
    type: String,
  },
   timezones: [{
     zoneName: {
        type: String,
      },
       gmtOffset: {
        type: String,
      },
       gmtOffsetName: {
        type: String,
      },
       abbreviation: {
        type: String,
      },
       tzName: {
        type: String,
      },
   }],
}]
}, { timestamps: true });


module.exports = mogoose.model('Country', userSchema);