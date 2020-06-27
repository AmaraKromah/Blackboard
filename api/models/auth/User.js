const _ = require("lodash"),
	bcrypt = require("bcrypt"),
	crypto = require("crypto"),
	jwt = require("jsonwebtoken");
const mongoose = require("mongoose"),
	Schema = mongoose.Schema;

const moment = require("moment");
//todo: JWT Secret, plaatsen in env
const jwtSecret = "51778657246321226641fsdklafjasdkljfsklfjd7148924065";

let UserSchema = new Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true, trim: true, unique: true },
	password: { type: String, required: true },
	verified: { type: Boolean, default: false },
	role: [
		{
			type: Schema.Types.ObjectId,
			ref: "Role",
		},
	],
	created_on: { type: Date, default: Date.now },
	updated_on: { type: Date },
	sessions: [
		{
			token: { type: String, required: true },
			expiresAt: { type: Number, required: true },
		},
	],
});

/**
 *- INSTANCE METHODS
 */

UserSchema.methods.current_date = () => {
	return moment();
};

//- normal to json return all fields, we don't want that!
UserSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();
	//return doc except password and session
	return _.omit(userObject, ["password", "sessions"]);
};
UserSchema.methods.generateAccessAuthToken = async function (durationInmin = 15, interval = "m") {
	const user = this;
	try {
		return jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: `${durationInmin}${interval}` });
	} catch (error) {
		throw new Error("something went wrong while creating a token: ", error);
	}
};

/**
 * This method  generates a 64byte hex string.
 * It doesn't save it to the database. SaveSessionToDatabase() does that
 */
UserSchema.methods.generateRefreshAuthToken = function () {
	return new Promise((resolve, reject) => {
		crypto.randomBytes(64, (err, buf) => {
			if (!err) {
				let token = buf.toString("hex");
				return resolve(token);
			} else {
				reject(err.message);
			}
		});
	});
};

/**
 * Generate 64bit token and store.
 * update user session with new token
 */
UserSchema.methods.createSession = async function (durationInDays = 10) {
	let user = this;
	try {
		let generateRefreshToken = await user.generateRefreshAuthToken();

		// returns a (refresh)token
		return saveSessionToDatabase(user, generateRefreshToken, durationInDays);
	} catch (error) {
		return Promise.reject("Failed to save session to database.\n" + error.message);
	}
};

/**
 *- MODEL METHODS (static methods)
 */
UserSchema.statics.getJWTSecret = () => {
	return jwtSecret;
};

UserSchema.statics.findByIdAndToken = async function (_id, token) {
	// finds user by id and token
	// used in auth middleware (verifySession)
	let User = this;
	return await User.findOne({
		_id,
		"sessions.token": token,
	});
};
UserSchema.statics.findByCredentials = async function (email, password) {
	let User = this;
	let findUser = await User.findOne({ email });
	if (!findUser) return null;
	let passMatched = await bcrypt.compare(password, findUser.password);
	return passMatched ? findUser : null;
};
UserSchema.statics.hasRefreshTokenExpired = expiresAt => {
	// convert miliseconds to seconds/ true = has expired
	let secondsSinceEpoch = Date.now() / 1000;
	return expiresAt > secondsSinceEpoch ? false : true;
};

/**
 *- MIDDLEWARE
 */

/**
 * Encrypt the password, false the second save in saveSession
 
 */
//# DONE
UserSchema.pre("save", async function (next) {
	let user = this;
	let salt = 10;
	if (user.password && user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, salt);
		next();
	}
	next();
});

/**
 *- HELPER METHODS
 */
/**
 * Saves the session (refresh token + expiry time)
 * And update the user with the the newly created session
 */
let saveSessionToDatabase = async (user, refreshToken, durationInDays=10) => {
	try {
		let expiresAt = generateRefreshTokenExpiryTime(durationInDays);
		await user.sessions.push({ token: refreshToken, expiresAt });

		let saveUser = await user.save();
		if (saveUser.sessions.length > 0) return refreshToken;
	} catch (error) {
		throw new Error(error.message);
	}
};

/**
 * Generate seconds untill givin duration in days
 */
//# DONE
let generateRefreshTokenExpiryTime = durationInDays => {
	let daysUntilExpire = durationInDays;
	let secondsUntilExpire = daysUntilExpire * 24 * 60 * 60;
	return Date.now() / 1000 + secondsUntilExpire;
};

//Export model
module.exports = mongoose.model("User", UserSchema);
