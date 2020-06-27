const bcrypt = require("bcrypt"),
	jwt = require("jsonwebtoken"),
	async = require("async");

const Users = require("../models/auth/User"),
	mailer = require("../helpers/mailers/nodemailer");
/**
 *# PARANT ROUTE :auth
 */
/*

*/
/**
 * GET /signup/email-check
 * Purpose: check if email already exsist
 * TODO: Proberen code die herbruikbaar te zijn apart te zetten
 */
exports.auth_check_email = async (req, res, next) => {
	//maak hier een function van (herbruikbaar)
	let email = req.query.email;
	try {
		user = await Users.find({
			email: email,
		});
		return user.length > 0 ? res.status(200).json(true) : res.status(200).json(false);
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

/**
 * POST /signup
 * Purpose: Sign up
 */
exports.auth_signup = async (req, res) => {
	try {
		user = await Users.find({
			email: req.body.email,
		});

		//- User exist (user returns array)
		if (user.length >= 1) {
			return res.status(403).json({
				message: `${req.body.email} already exist`,
			});
		}
		let body = req.body,
			newUser = await new Users(body).save();
		if (newUser) {
			let accessToken = await newUser.generateAccessAuthToken(48, "h");
			if (accessToken) {
				//- Send mail with access token
				const url = `http://localhost:4200/auth/confirmation/${accessToken}`;
				try {
					mailer.transport.sendMail(
						mailer.options.confirm_email_options({
							email: `${newUser.email}`,
							url: url,
						}),
						(error, info) => {
							if (error) {
								return res.status(500).json({
									message: error.message,
								});
							}
							console.log("Message sent: %s", info.messageId);
							if (accessToken)
								res.header("x-access-token", accessToken)
									.status(201)
									.json({ message: `Thanks for registration. An activation link was send to ${req.body.email} `, newUser });
						}
					);
				} catch (error) {
					return res.status(500).json({
						message: error.message,
					});
				}
			}
		}
	} catch (error) {
		return res.status(500).json({ message: "Someting went wrong", error: error.message });
	}
};

// TODO UPDATE THIS !!
exports.auth_confirm = async (req, res) => {
	let token = req.params.token;
	try {
		let { _id } = jwt.verify(token, Users.getJWTSecret(), function (error, decode) {
			if (error) {
				if (error.name == "TokenExpiredError") {
					console.log("TOKEN EXPIRED");
					// todo token expired afhandelen
					return res.status(401).json({
						message: "Link is no longer valid or something went wrong please try registering again",
						error: error.message,
					});
				}
			}
			return decode;
		});
		if (_id) {
			registeredUser = await Users.findByIdAndUpdate(_id, { verified: true }, { useFindAndModify: false });
			let refreshToken = registeredUser.createSession(10),
				accessToken = registeredUser.generateAccessAuthToken();
			tokens = await Promise.all([refreshToken, accessToken]);
			return res.header("x-refresh-token", tokens[0]).header("x-access-token", tokens[1]).status(200).json({
				message: "You have succesfully confirmed your email, you may now login",
				userId: _id,
			});
		}
	} catch (error) {
		return res.status(401).json({
			message: "Something went wrong (confirm) please try again",
			error: error.message,
		});
	}
};
/**
 * POST /signin
 * Purpose: Sign in
 */
exports.auth_signin = async (req, res, next) => {
	let email = req.body.email;
	let password = req.body.password;
	try {
		let logginUser = await Users.findByCredentials(email, password);
		if (!logginUser) {
			return res.status(401).json({
				message: "Authentication Failed",
			});
		}
		/**
		 * todo:
		 * do regulate verification
		 */

		let refreshToken = logginUser.createSession(10),
			accessToken = logginUser.generateAccessAuthToken(15);

		tokens = await Promise.all([refreshToken, accessToken]);
		if (tokens[0] && tokens[1])
			res.header("x-refresh-token", tokens[0]).header("x-access-token", tokens[1]).status(200).send({ message: "Authentication succesvol", logginUser });
	} catch (error) {
		return res.status(500).json({ message: "Someting went wrong", error: error.message });
	}
};

/**
 * GET /tokens/access-token
 * Purpose: generates and returns an access token
 */
exports.get_access_token = async (req, res, next) => {
	// we know that the user/caller is authenticated and we have the user_id and user object available to us
	console.log("I'm called for REFRESH");
	try {
		let accessToken = await req.userObject.generateAccessAuthToken(15, "s");
		if (accessToken) res.header("x-access-token", accessToken).status(200).json({ accessToken });
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};
/////////////////////////////////////////////////////////////////
//TODO LEFT
/**
 * POST /forgot
 * Purpose: Request a new password
 */
exports.pass_forgot_create = async (req, res, next) => {
	/*
    todo: Security question when resetting password
    */
	let email = req.body.email;
	try {
		user = await Users.findOne({ email });
		if (!user) {
			return res.status(400).json({
				message: "No user with such email",
			});
		}
		// - Create token if email exist

		let accessToken = await user.generateAccessAuthToken(1, "h");
		const url = ` http://localhost:4200/auth/reset-password/${accessToken}`;

		//- Send mail
		try {
			mailer.transport.sendMail(
				mailer.options.reset_pass_options({
					email: `${user.email}`,
					url: url,
				}),
				(error, info) => {
					if (error) {
						return res.status(500).json({
							message: error.message,
						});
					}
					console.log("Message sent: %s", info.messageId);

					return res.status(202).json({
						message: `Process to reset your password has been send to your email `,
					});
				}
			);
		} catch (error) {
			return res.status(500).json({
				message: error.message,
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: "Something went wrong",
			error: error.message,
		});
	}
};
/**
 * POST /reset/:token
 * Purpose: Reset password using token
 */
//todo reset accest link in header
exports.pass_forgot_consume_token = async (req, res, next) => {
	let token = req.params.token;
	let password = req.body.password;
	try {
		//- try to verify the token
		let { _id } = jwt.verify(token, Users.getJWTSecret());

		if (_id) {
			try {
				hashed_pass = await bcrypt.hash(password, 10);
				//- try to update the user password
				if (hashed_pass) {
					updateUser = await Users.findByIdAndUpdate(_id, { password: hashed_pass }, { useFindAndModify: false });
					let refreshToken = updateUser.createSession(10),
						accessToken = updateUser.generateAccessAuthToken();
					tokens = await Promise.all([refreshToken, accessToken]);
					if (updateUser) {
						return res.header("x-refresh-token", tokens[0]).header("x-access-token", tokens[1]).status(200).json({
							message: "Your password has been updated, Try not to forget it",
							userId: _id,
						});
					}
				}
			} catch (error) {
				return res.status(500).json({
					message: "Something went wrong",
					error: err.message,
				});
			}
		}
	} catch (error) {
		return res.status(401).json({
			message: "Something went wrong, Link is no longer valid or something went wrong please try again",
			error: error.message,
		});
	}
};
