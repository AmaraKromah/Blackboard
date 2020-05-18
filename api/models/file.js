const mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let FileSchema = new Schema({
	name: { type: String, required: true },
	url: String,
	ext: String, // extention
	type: String // type of file (pdf, image...)
});

//Export model
module.exports = mongoose.model("File", FileSchema);
