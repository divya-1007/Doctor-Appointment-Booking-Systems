const mogoose = require('mongoose');
const userSchema = new mogoose.Schema({
state: [{
    name: {
    type: String,
    },
    isoCode: {
    type: String,
    },
    countryCode: {
    type: String,
    },

}],
countryId: {
     type: mogoose.Schema.Types.ObjectId,
      ref: "Country",
    },
}, { timestamps: true });


module.exports = mogoose.model('State', userSchema);