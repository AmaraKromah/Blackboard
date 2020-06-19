/*
    Todo : 
        - Validation for  login         
*/

const { body, validationResult } = require("express-validator");

exports.registerValidationRules = () => {
	return [
		body("first_name").trim().isLength({ min: 1 }).withMessage("First name is required "),
		body("last_name").trim().isLength({ min: 1 }).withMessage("Last name is required"),
		body("email").trim().isLength({ min: 1 }).withMessage("Email is required").isEmail().withMessage("Not a valid email"),

		//# Password validation
		body("password")
			.isLength({ min: 6 })
			.withMessage("password must be atleast 6 long")
			.matches("(?=.*[A-Z])")
			.withMessage("password must contain one capital letter")
			.matches("[-+_!@#$%^&*.,?]")
			.withMessage("password must contain one special character")
			.matches("[0-9]")
			.withMessage("password must contain one number")
			// pasword confirm
			.custom((value, { req, loc, path }) => {
				if (value !== req.body.comfirmPassword) {
					// trow error if passwords do not match
					throw new Error("Passwords don't match");
				} else {
					return value;
				}
			}),
	];
};

exports.loginValidationRules = () => {
	return [body("email").trim().isLength({ min: 1 }).withMessage("Email is required").isEmail().withMessage("Not a valid email")];
};

exports.resetPassValidationRules = () => {
	return [
		//# Password validation
		body("password")
			.isLength({ min: 6 })
			.withMessage("password must be atleast 6 long")
			.matches("(?=.*[A-Z])")
			.withMessage("password must contain one capital letter")
			.matches("[-+_!@#$%^&*.,?]")
			.withMessage("password must contain one special character")
			.matches("[0-9]")
			.withMessage("password must contain one number")
			//- pasword confirm
			.custom((value, { req, loc, path }) => {
				if (value !== req.body.confirm_password) {
					//- trow error if passwords do not match
					throw new Error("Passwords don't match");
				} else {
					return value;
				}
			}),
	];
};
/*       VALIIDATE            */

exports.validate = (req, res, next) => {
	// console.log("ERROR ARRAY, ",errors.array())
	const errors = validationResult(req);
	if (errors.isEmpty()) {
		return next();
	}
	const extractedErrors = [];
	errors.array().map(err =>
		extractedErrors.push({
			[err.param]: err.msg,
		})
	);
	res.status(422).json({
		Error: "Creation Error",
		errors_details: extractedErrors,
	});
};
