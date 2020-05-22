const mongoose = require("mongoose"),
	moment = require("moment"),
	Schema = mongoose.Schema;

let AssigmentSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	type: {
		type: String,
		enum: [ "hoorcollege", "practicum", "regular" ],
		default: "regular"
	},
	file: [ { type: Schema.Types.ObjectId, ref: "File" } ],
	subject: { type: Schema.Types.ObjectId, ref: "Subject" }, // vak
	teacher: { type: Schema.Types.ObjectId, ref: "User" },
	deadline: { type: Date },
	send_at: { type: Date, default: Date.now() },
	changed_at: { type: Date }
});

/**
 * todo:
 * -Date in moment time (readable)
 * 
 */

//Export model
module.exports = mongoose.model("Assigment", AssigmentSchema);
