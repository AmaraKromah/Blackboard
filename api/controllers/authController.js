const bcrypt = require("bcrypt"),
	jwt = require("jsonwebtoken"),
	async = require("async");

const Users = require("../models/auth/User"),
	mailer = require("../helpers/mailers/nodemailer"),
	reuse = require("../helpers/re_useables/reuse");

/*

TODO: 
	- Proberen code die herbruikbaar te zijn apart te zetten 
*/

exports.auth_signup = async (req, res, next) => {
	let JWT_EMAIL_KEY = process.env.JWT_EMAIL_KEY;
	try {
		users = await Users.find({
			email: req.body.email,
		});

		//- User exist (user returns array)
		if (users.length >= 1) {
			return res.status(403).json({
				message: `${req.body.email} already exist`,
			});
		}
		//- User doesn't exsist, so we create one with hashed pass
		hashed_pass = await bcrypt.hash(req.body.password, 10);
		let new_user = await new Users({
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			email: req.body.email,
			password: hashed_pass,
		}).save();

		//- Create token for mail
		jwt.sign(
			{
				id: new_user._id,
			},
			JWT_EMAIL_KEY,
			{
				expiresIn: "1d",
			},
			(err, token) => {
				const url = `http://localhost:4200/auth/confirmation/${token}`;

				//# send mail , maak hier een middelware van
				try {
					mailer.transport.sendMail(
						mailer.options.confirm_email_options({
							email: `${new_user.email}`,
							url: url,
						}),
						(error, info) => {
							if (error) {
								return res.status(500).json({
									message: error.message,
								});
							}
							console.log("Message sent: %s", info.messageId);

							return res.status(200).json({
								message: `welcome ${req.body.email} `,
								user: new_user,
							});
						}
					);
				} catch (error) {
					return res.status(500).json({
						message: error.message,
					});
				}
			}
		);
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

exports.auth_confirm = async (req, res, next) => {
	let token = req.params.token;
	let EMAIL_KEY = process.env.JWT_EMAIL_KEY;

	try {
		// try to verify the token
		const { id } = jwt.verify(token, EMAIL_KEY);

		// try to update the user
		//! Maybe this should be in a try catch or use a Promise
		let up_user = await Users.findByIdAndUpdate(id, { verified: true }, { useFindAndModify: false });

		//If user was updated response positive else throw error
		if (!up_user) {
			throw new Error("Link no longer valid");
		}
		return res.status(200).json({
			message: "You have succesfully confirmed your email, you may now login",
		});
	} catch (error) {
		return res.status(401).json({
			message: "Link is no longer valid or something went wrong please try again",
			error: error.message,
		});
	}
};

exports.auth_signin = async (req, res, next) => {
	console.log("bob");
	let email = req.body.email;
	let password = req.body.password;
	let JWT_EMAIL_KEY = process.env.JWT_EMAIL_KEY;

	// ! Misschien waterval async gebruiken?
	try {
		user = await Users.findOne({
			email,
		}).exec();

		// Wrong Email
		if (!user) {
			return res.status(403).json({
				message: "Authentication Failed",
			});
		}

		//- Check if user is verified
		if (!user.verified) {
			return res.status(403).json({
				message: "Please verify your email",
			});
		}

		//- Verify password (returns true/false)
		isPassMatched = await bcrypt.compare(password, user.password);
		if (!isPassMatched) {
			return res.status(403).json({
				message: "Authentication Failed",
			});
		}

		//-Logged in, create a JWT  token
		jwt.sign(
			{
				id: user._id,
				email: user.email,
			},
			JWT_EMAIL_KEY,
			{
				expiresIn: "7d",
			},
			(err, token) => {
				return res.status(200).json({
					message: "Authentication succesvol",
					token: token,
				});
			}
		);
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
};

exports.pass_forgot_create = async (req, res, next) => {
	/*
    todo: Security question when resetting password
    */
	let email = req.body.email;
	JWT_KEY = process.env.JWT_RESET_EMAIL_KEY;

	try {
		//- Check if email exsist
		user = await Users.findOne({
			email: email,
		});

		// Wrong Email
		if (!user) {
			return res.status(404).json({
				message: "No user witch such email",
			});
		}
		// - Create token if email exist
		let token = await reuse.create_token({
			info: { id: user._id },
			JWT_KEY,
			expiresIn: "10m",
		});

		// - create link for mailer
		const url = ` http://localhost:4200/auth/reset-password/${token}`;

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

exports.pass_forgot_get_token = async (req, res, next) => {
	let token = req.params.token;
	let JWT_KEY = process.env.JWT_RESET_EMAIL_KEY;
	try {
		//- try to verify the token
		let { id } = await reuse.consume_token({
			token,
			JWT_KEY,
		});

		// verification failed
		if (!id) {
			return res.status(401).json({
				message: "Link is no longer valid or something went wrong please try again",
			});
		}

		return res.status(200).json({
			message: "You may now reset your pass",
			token: req.params.token,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Something went wrong",
			error: error,
		});
	}
};
exports.pass_forgot_consume_token = async (req, res, next) => {
	let token = req.params.token;
	let password = req.body.password;
	let JWT_KEY = process.env.JWT_RESET_EMAIL_KEY;
	console.log(token, password, JWT_KEY);
	try {
		//- try to verify the token
		let { id } = await reuse.consume_token({
			token,
			JWT_KEY,
		});

		// verification failed
		if (!id) {
			return res.status(401).json({
				message: "Link is no longer valid or something went wrong please try again",
			});
		}

		//- Hash our password
		hashed_pass = await bcrypt.hash(password, 10);
		//- try to update the user password
		Users.findByIdAndUpdate(id, { password: hashed_pass }, { useFindAndModify: false })
			.exec()
			.then(updated => {
				return res.status(200).json({
					message: "Your password has been updated, Try not to forget it",
				});
			})
			.catch(err => {
				return res.status(401).json({
					message: "Something went wrong",
					error: err.message,
				});
			});
	} catch (error) {
		return res.status(500).json({
			message: "Something went wrong",
			error: error.message,
		});
	}
};
