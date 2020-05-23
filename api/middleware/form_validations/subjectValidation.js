const { body, validationResult } = require("express-validator");

exports.subjectValidationRules = () => {
	return [
		body("name").trim().isLength({ min: 1 }).withMessage("Name is required").escape(),
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

	res.status(422).json({
		Error: "An error occured",
		errors_details: extractedErrors
	});
};
