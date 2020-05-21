const bcrypt = require("bcrypt"),
	jwt = require("jsonwebtoken"),
	async = require("async");

const Users = require("../models/auth/User"),
	mailer = require("../helpers/mailers/nodemailer");

/*

TODO: 
	- Proberen code die herbruikbaar te zijn apart te zetten 
*/

exports.auth_signup = async (req, res, next) => {
	let JWT_EMAIL_KEY = process.env.JWT_EMAIL_KEY;
	try {
		users = await Users.find({
			email: req.body.email
		});

		//- User exist (user returns array)
		if (users.length >= 1) {
			return res.status(403).json({
				message: `${req.body.email} already exist`
			});
		}
		//- User doesn't exsist, so we create one with hashed pass
		hashed_pass = await bcrypt.hash(req.body.password, 10);
		let new_user = await new Users({
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			email: req.body.email,
			password: hashed_pass
		}).save();

		//- Create token for mail
		jwt.sign(
			{
				id: new_user._id
			},
			JWT_EMAIL_KEY,
			{
				expiresIn: "1d"
			},
			(err, token) => {
				const url = ` http://localhost:3000/auth/confirmation/${token}`;

				// Send mail
				try {
					mailer.transport.sendMail(
						mailer.options.confirm_email_options({
							email: `${new_user.email}`,
							url: url
						}),
						(error, info) => {
							if (error) {
								return res.status(500).json({
									message: error.message
								});
							}
							console.log("Message sent: %s", info.messageId);

							return res.status(200).json({
								message: `welcome ${req.body.email} `,
								created_user_info: new_user
							});
						}
					);
				} catch (error) {
					return res.status(500).json({
						message: error.message
					});
				}
			}
		);
	} catch (error) {
		return res.status(500).json({
			message: error.message
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
			message: "You have succesfully confirmed your email, you may now login"
		});
	} catch (error) {
		return res.status(401).json({
			message: "Link is no longer valid or something went wrong please try again",
			error: error.message
		});
	}
};

exports.auth_signin = async (req, res, next) => {
	let email = req.body.email;
	let password = req.body.password;
	let JWT_EMAIL_KEY = process.env.JWT_EMAIL_KEY;

	// ! Misschien waterval async gebruiken?
	try {
		user = await Users.findOne({
			email
		}).exec();

		// Wrong Email
		if (!user) {
			return res.status(403).json({
				message: "Authentication Failed"
			});
		}

		//- Check if user is verified
		if (!user.verified) {
			return res.status(403).json({
				message: "Please verify your email"
			});
		}

		//- Verify password (returns true/false)
		isPassMatched = await bcrypt.compare(password, user.password);
		if (!isPassMatched) {
			return res.status(403).json({
				message: "Authentication Failed"
			});
		}

		//-Logged in, create a JWT  token
		jwt.sign(
			{
				id: user._id,
				email: user.email
			},
			JWT_EMAIL_KEY,
			{
				expiresIn: "7d"
			},
			(err, token) => {
				return res.status(200).json({
					message: "Authentication succesvol",
					token: token
				});
			}
		);
	} catch (error) {
		return res.status(500).json({
			message: error.message
		});
	}
};
