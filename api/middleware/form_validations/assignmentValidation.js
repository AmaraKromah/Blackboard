const { body, validationResult } = require("express-validator");
const fs = require("fs");

exports.assignmentValidationRules = () => {
	return [
		body("title").trim().isLength({ min: 1 }).withMessage("Title is required").escape(),
		body("description").trim().isLength({ min: 1 }).withMessage("description is required").escape(),

		body("type")
			.trim()
			.custom((value, { req, loc, path }) => {
				if (String(value).match(/\b(?:" "|hoorcollege|practicum|regular)\b/)) {
					// trow error if passwords do not match
					return value;
				} else {
					throw new Error(`${value} is a wrong type`);
				}
			})
			.escape()
	];
};

//////////////        VALIIDATE            ///////////////////////

exports.validate = async (req, res, next) => {
	let del_files = req.files;
	const errors = validationResult(req);
	if (errors.isEmpty()) {
		return next();
	}
	const extractedErrors = [];
	errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

	//- delete all files to make sure none are passed

	let file_errors = [];

	await del_files.forEach(async file => {
		fs.unlink(file.path, err => {
			if (err) file_errors.push({ message: err });
		});
	});

	if (file_errors.length >= 1) {
		return res.status(422).json({
			message: "Something went wrong",
			error: errors
		});
	}
	res.status(422).json({
		Error: "Creation Error",
		errors_details: extractedErrors
	});
};
