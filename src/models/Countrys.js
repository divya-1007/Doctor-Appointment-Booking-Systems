const mogoose = require('mongoose');

const stateSchema = new mogoose.Schema({
  name: String,
  isoCode: String,
  countryCode: String,
  population: Number,
  // Other state-specific fields
});


const userSchema = new mogoose.Schema({
  isoCode: {
    type: String,
  },
  countryName: {
    type: String,
  },
  states: [stateSchema],
   
}, { timestamps: true });


module.exports = mogoose.model('Country', userSchema);