var express = require("express");
// var router = express.Router();
var router = express.Router({ mergeParams: true });
const moment = require("moment");
const fs = require("fs");

const Assignments = require("../models/courses/assigment"),
	Users = require("../models/auth/User"), // for teachers
	Subjects = require("../models/courses/subject"),
	Files = require("../models/file");

const { assignments_list, assignments_create, assigments_delete, assigments_update } = require("../controllers/assignmentController"),
	{ assignmentValidationRules, validate } = require("../middleware/form_validations/assignmentValidation"),
	{ authenticate } = require("../middleware/auth/authorization");

const fileUpload = require("../helpers/files/file_uploader");

// todo:  Permission, push to controller

router.get("/", authenticate, assignments_list);

// todo validation before other middelwares
router.post(
	"/",
	authenticate,
	fileUpload({ fileSize: 50, fieldNameSize: 50, fieldName: "files", maxFilesAmount: 5 }),
	// assignmentValidationRules(),
	// validate,
	assignments_create
);

//- Get one
router.get("/:id", async (req, res, next) => {
	let id = req.params.id;
	let assignment = await Assignments.findById(id).populate("file", " _id url name");
	if (!assignment) return res.status(404).json({ message: "Assignment doesn't exist" });
	res.status(200).json({
		message: "Getting  assigment with associated files",
		assignment: assignment,
	});
});
//- update one
router.patch(
	"/:id",
	authenticate,
	fileUpload({ fileSize: 50, fieldNameSize: 50, fieldName: "files", maxFilesAmount: 5 }),
	// assignmentValidationRules(),
	// validate,
	assigments_update
);

//- delete one
router.delete("/:id", authenticate, assigments_delete);

// delete all
// router.delete("/", async (req, res, next) => {
// 	res.status(201).json({
// 		message: "Deleted all assigments with associated files"
// 	});
// });

module.exports = router;
