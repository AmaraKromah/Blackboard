const mongoose = require("mongoose"),
	moment = require("moment"),
	Schema = mongoose.Schema;

let AssigmentSchema = new Schema({
	subject: { type: Schema.Types.ObjectId, ref: "Subject" }, 
	teacher: { type: Schema.Types.ObjectId, ref: "User" },
	classroom: { type: String },
	type: {
		type: String,
		enum: [ "hoorcollege", "practicum", "regular" ],
	},
	
	begin_date: { type: String },
	end_date: { type: String },
	begin_time: { type: String },
	end_time: { type: String },

	created_at: { type: Date, default: Date.now() },
	changed_at: { type: Date, default: Date.now() }
});

/**
 * todo:
 * -Date in moment time (readable)
 * 
 */

//Export model
module.exports = mongoose.model("Scedule", AssigmentSchema);
