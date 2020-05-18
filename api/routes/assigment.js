var express = require("express");
var router = express.Router();
const moment = require("moment");

const Assignments = require("../models/courses/assigment"),
	Users = require("../models/auth/User"), // for teachers
	Subjects = require("../models/courses/subject"),
	Files = require("../models/file");

const { assignments_list, assignments_create } = require("../controllers/assignmentController"),
	{ isAuth } = require("../middleware/auth/authorization");

const fileUpload = require("../helpers/files/file_uploader");

/* Assigments */

/**
 * todo:  Permission, push to controller
 */

router.get("/", isAuth, assignments_list);

// todo validation before other middelwares
router.post(
	"/",
	isAuth,
	fileUpload({
		fileSize: 50,
		fieldNameSize: 50,
		fieldName: "file",
		maxFilesAmount: 5
	}),
	assignments_create
);

// delete all
router.delete("/", async (req, res, next) => {
	res.status(201).json({
		message: "Deleted all assigments with associated files"
	});
});
/**
 *# Single
 */

//- Get/update one

router.get("/:id", async (req, res, next) => {});
router.patch("/:id", async (req, res, next) => {});

//- delete one
router.delete("/:id", async (req, res, next) => {});

module.exports = router;
