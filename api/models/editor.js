const mongoose = require("mongoose"),
	Schema = mongoose.Schema;

let EditorSchema = new Schema({
	description: String,

});

//Export model
module.exports = mongoose.model("Editor", EditorSchema);
