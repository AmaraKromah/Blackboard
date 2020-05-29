const mongoose = require("mongoose"),
	Schema = mongoose.Schema;

const moment = require("moment");

// Education = Opleiding
let EducationSchema = new Schema({
	name: String,
	begin_date: Date,
	end_date: Date
});

// Virtual get years
EducationSchema.virtual("years").get(function(){
	return typeof this.begin_date != "undefined" && typeof this.end_date != "undefined"
		? moment(this.end_date).year() - moment(this.begin_date).year()
		: "";
});

//Export model
module.exports = mongoose.model("Education", EducationSchema);
