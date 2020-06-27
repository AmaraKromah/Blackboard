const express = require("express");
const router = express.Router();
const { registerValidationRules, validate } = require("../../middleware/auth/authValidation"),
	{ verifySession } = require("../../middleware/auth/authorization"),
	{
		auth_signup,
		auth_check_email,
		auth_signin,
		auth_confirm,
		get_access_token,
		pass_forgot_create,
		pass_forgot_consume_token,
	} = require("../../controllers/authController");
	
router.get("/signup/email-check", auth_check_email);

// router.post("/signup", registerValidationRules(), validate, auth_signup);
router.post("/signup", auth_signup);

//////////////////////////////////

router.get("/confirmation/:token", auth_confirm);
router.post("/signin", auth_signin);
router.get("/tokens/access-token", verifySession, get_access_token);

/*
    todo: Maybe inmplement a way to make sure a reset pass is only issued once
	within a given time 
	 todo: inmplement a password confirm + validations
*/
router.post("/forgot", pass_forgot_create);
router.post("/reset/:token", pass_forgot_consume_token);

module.exports = router;
