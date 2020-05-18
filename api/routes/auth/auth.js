const express = require("express");
const router = express.Router(),
	jwt = require("jsonwebtoken");

const { registerValidationRules, validate } = require("../../middleware/auth/authValidation");

const { auth_signup, auth_signin, auth_confirm } = require("../../controllers/authController");

const Users = require("../../models/auth/User");

const reuse = require("../../helpers/re_useables/reuse"),
	mailer = require("../../helpers/mailers/nodemailer");

const bcrypt = require("bcrypt");

// Sign up
// router.post("/signup", registerValidationRules(), validate, auth_signup);
router.post("/signup", auth_signup);

router.get("/confirmation/:token", auth_confirm);

router.post("/signin", auth_signin);

// todo password forget
router.post("/forgot", async function(req, res, next){
	/*
    todo: Security question when resetting password
    */
	let email = req.body.email;
	JWT_KEY = process.env.JWT_RESET_EMAIL_KEY;

	try {
		//- Check if email exsist
		user = await Users.findOne({
			email: email
		});

		// Wrong Email
		if (!user) {
			return res.status(404).json({
				message: "No user witch such email"
			});
		}
		// - Create token if email exist
		let token = await reuse.create_token({
			info: { id: user._id },
			JWT_KEY,
			expiresIn: "10m"
		});

		// - create link for mailer
		const url = ` http://localhost:3000/auth/reset/${token}`;

		//- Send mail
		try {
			mailer.transport.sendMail(
				mailer.options.reset_pass_options({
					email: `${user.email}`,
					url: url
				}),
				(error, info) => {
					if (error) {
						return res.status(500).json({
							message: error.message
						});
					}
					console.log("Message sent: %s", info.messageId);

					return res.status(202).json({
						message: `Process to reset your password has been send to your email `
					});
				}
			);
		} catch (error) {
			return res.status(500).json({
				message: error.message
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: "Something went wrong",
			error: error.message
		});
	}
});

router.get("/reset/:token", async function(req, res, next){
	/*
    todo: Maybe inmplement a way to make sure a reset pass is only issued once
          within a given time 
    */

	let token = req.params.token;
	let JWT_KEY = process.env.JWT_RESET_EMAIL_KEY;

	try {
		//- try to verify the token
		let { id } = await reuse.consume_token({
			token,
			JWT_KEY
		});

		// verification failed
		if (!id) {
			return res.status(401).json({
				message: "Link is no longer valid or something went wrong please try again"
			});
		}

		return res.status(200).json({
			message: "You may now reset your pass",
			token: req.params.token
		});
	} catch (error) {}
});

router.post("/reset/:token", async function(req, res, next){
	/*
    todo: inmplement a password confirm + validations    
    */
	let token = req.params.token;
	let password = req.body.password;
	let JWT_KEY = process.env.JWT_RESET_EMAIL_KEY;

	try {
		//- try to verify the token
		let { id } = await reuse.consume_token({
			token,
			JWT_KEY
		});

		// verification failed
		if (!id) {
			return res.status(401).json({
				message: "Link is no longer valid or something went wrong please try again"
			});
		}

		//- Hash our password
		hashed_pass = await bcrypt.hash(password, 10);
		console.log("normal password: ", password, "Hashed password: ", hashed_pass);

		//- try to update the user password
		Users.findByIdAndUpdate(id, { password: hashed_pass }, { useFindAndModify: false })
			.exec()
			.then(updated => {
				return res.status(200).json({
					message: "Your password has been updated, Try not to forget it"
				});
			})
			.catch(err => {
				return res.status(401).json({
					message: "Something went wrong",
					error: err.message
				});
			});
	} catch (error) {
		return res.status(500).json({
			message: "Something went wrong",
			error: error.message
		});
	}
});

module.exports = router;
