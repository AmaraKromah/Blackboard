const mongoose = require("mongoose"),
	moment = require("moment"),
	Schema = mongoose.Schema;

let SceduleSchema = new Schema({
	subject: { type: Schema.Types.ObjectId, ref: "Subject" },
	teacher: { type: Schema.Types.ObjectId, ref: "User" },
	classroom: { type: String },
	type: {
		type: String,
		enum: ["hoorcollege", "practicum", "regular"],
	},
	beginDateTime: { type: Date },
	endDateTime: { type: Date },
	repeated: Boolean, // misschien niet nodig
	repeatedDates: [
		{
			beginDateTime: Date,
			endDateTime: Date,
		},
	],
	created_at: { type: Date, default: Date.now() },
	changed_at: { type: Date, default: Date.now() },
});

//Export model
module.exports = mongoose.model("Scedule", SceduleSchema);
