const mongoose = require('mongoose'),
    Schema = mongoose.Schema;


let SubjectSchema = new Schema({
    name: {type: String},
    teacher: [{type: Schema.Types.ObjectId, ref: 'User'}],
    education: [{type: Schema.Types.ObjectId, ref: 'Education'}],
})


//Export model
module.exports = mongoose.model('Subject', SubjectSchema);