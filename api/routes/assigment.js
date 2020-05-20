var express = require("express");
var router = express.Router();
const moment = require("moment");
const fs = require("fs");

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
		// uploadtype: "array",
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

router.get("/:id", async (req, res, next) => {
	let id = req.params.id;
	let assignment = await Assignments.findById(id).populate("file", " _id url");

	res.status(200).json({
		message: "Getting  one Assigment with associated files",
		assignment: assignment
	});
});

router.patch("/:id", async (req, res, next) => {});

//- delete one

//  todo ERROR handling (and testing exspecially files) + auth + permission and auth


router.delete("/:id", async (req, res, next) => {
	let id = req.params.id;
	let files_ids = req.body.file;
	let only_files = req.body.file_only;

	//- convert tiles to array just in case
	if (!(files_ids instanceof Array)) {
		if (typeof files_ids === "undefined") files_ids = [];
		else files_ids = new Array(files_ids);
	}

	//- delete  assignment only if only_files (only files should be deleted and not the assigments itself)
	if (only_files === "false") {
		await Assignments.findByIdAndDelete(id);

		return res.status(202).json({
			message: "Assigment removed"
		});
	}
	//- delete all files_ids if any
	if (files_ids.length >= 1) {
		//-delete files
		files_ids.forEach(async file_id => {
			try {
				file = await Files.findById(file_id);

				if (file) {
					// -File exsist in public folder
					if (fs.existsSync(file.url)) {
						// - Delete file in public folder
						fs.unlink(file.url, err => {
							if (err) {
								res.status(500).json({
									message: "Unable to remove file",
									err: err
								});
							}
						});
					}

					// - delete file in db
					await Files.findByIdAndDelete(file_id);
				}
			} catch (err) {
				console.error(err);
			}
		});
	}
	res.status(202).json({
		message: "Removal succesfull"
	});
});

module.exports = router;
