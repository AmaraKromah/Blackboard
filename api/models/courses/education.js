const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Education = Opleiding
let EducationSchema = new Schema({
    name: {type: String}
})


//Export model
module.exports = mongoose.model('Education', EducationSchema);