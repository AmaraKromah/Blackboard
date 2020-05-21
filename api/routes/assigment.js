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

//- Get

router.get("/:id", async (req, res, next) => {
	let id = req.params.id;
	let assignment = await Assignments.findById(id).populate("file", " _id url");

	res.status(200).json({
		message: "Getting  one Assigment with associated files",
		assignment: assignment
	});
});

//- update one
router.patch("/:id", fileUpload({ fileSize: 50, fieldNameSize: 50, fieldName: "file", maxFilesAmount: 5 }), async (req, res, next) => {
	let id = req.params.id;
	let files = req.files;
	// let teacher = res.userData; // todo teacher's ID
	let files_id = [];

	//# files
	// - find assignment first

	task = await Assignments.findById(id).populate("file", "_id url ");
	task_files = task.file;

	// - Delete exsisting files in public folder
	if (task_files.length >= 1) {
		let errors = [];
		try {
			task_files.forEach(async file => {
				if (fs.existsSync(file.url)) {
					// - Delete file in public folder
					fs.unlink(file.url, error => {
						if (error) {
							errors.push({ message: error });
						}
					});
				} else {
					errors.push({ message: `File: ${file.url} doesn't exist` });
				}
			});
		} catch (error) {
			errors.push({ message: error });
		}

		if (errors.length >= 1) {
			//! misschien toegevoegde bestanden ook mee verwijderen?
			return res.status(500).json({
				message: "Something went wrong",
				err: errors
			});
		}
	}

	// - Delete exsisting files in database
	try {
		let to_delete_files_id = task_files.map(file => file._id);
		await Files.deleteMany({ _id: { $in: to_delete_files_id } });

		// //- Adding new (updated) file if any
		if (files.length >= 1) {
			for (let file of files) {
				new_file = await new Files({
					name: file.filename,
					url: file.path,
					ext: file.filename.split(".").pop(),
					type: file.mimetype
				}).save();
				files_id.push(new_file._id);
			}
		}

		//# Assignment
		// Updating Assignment
		let file = files_id.length >= 1 ? files_id : [];
		var update_task = {
			title: req.body.title,
			description: req.body.description,
			type: req.body.type,
			file: file,
			subject: req.body.subject,
			// teacher: teacher.id,
			deadline: req.body.deadline
		};
		updated_assignment = await Assignments.findByIdAndUpdate(id, update_task, { useFindAndModify: false });

		return res.status(200).json({
			message: "Updating Assigment",
			current_assignment: task,
			updated_assignment: update_task
		});
	} catch (error) {
		return res.status(500).json({
			message: "Something went wrong",
			error: error
		});
	}
});

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
