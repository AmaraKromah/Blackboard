const mongoose = require("mongoose"),
	Schema = mongoose.Schema;

const moment = require("moment");

let PostSchema = new Schema({
	title: String,
	content: String,
	imagePath: String,
});

module.exports = mongoose.model("Post", PostSchema);
