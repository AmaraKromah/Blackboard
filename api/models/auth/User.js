const mongoose = require("mongoose"),
	Schema = mongoose.Schema;

const moment = require("moment");

let UserSchema = new Schema({
	firstname  : { type: String },
	lastname   : { type: String },
	email      : { type: String },
	password   : { type: String },
	verified     : { type: Boolean, default: false },
	role       : [
		{
			type : Schema.Types.ObjectId,
			ref  : "Role"
		}
	],
	created_on : { type: Date, default: Date.now },
	updated_on : { type: Date }
});

UserSchema.methods.current_date = () => {
	return moment();
};

//Export model
module.exports = mongoose.model("User", UserSchema);
