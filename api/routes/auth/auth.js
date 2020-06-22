const express = require("express");
const router = express.Router(),
	jwt = require("jsonwebtoken");

const { registerValidationRules, validate } = require("../../middleware/auth/authValidation");

const {
	auth_signup,
	auth_check_email,
	auth_signin,
	auth_confirm,
	pass_forgot_create,
	pass_forgot_get_token,
	pass_forgot_consume_token,
} = require("../../controllers/authController");

const Users = require("../../models/auth/User");

// const reuse = require("../../helpers/re_useables/reuse"),
// 	mailer = require("../../helpers/mailers/nodemailer");

const bcrypt = require("bcrypt");

// Sign up
// router.post("/signup", registerValidationRules(), validate, auth_signup);
router.post("/signup", auth_signup);
router.get("/signup/email-check", auth_check_email);

router.get("/confirmation/:token", auth_confirm);

router.post("/signin", auth_signin);

router.post("/forgot", pass_forgot_create);

/*
    todo: Maybe inmplement a way to make sure a reset pass is only issued once
	within a given time 
*/
router.get("/reset/:token", pass_forgot_get_token);

// todo: inmplement a password confirm + validations

router.post("/reset/:token", pass_forgot_consume_token);

module.exports = router;
