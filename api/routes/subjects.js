const express = require("express"),
	router = express.Router();

// const fetch = require("node-fetch");
const mongoose = require("mongoose"),
	fs = require("fs");

const { subject_list } = require("../controllers/subjectController");

const Subjects = require("../models/courses/subject"),
	educations = require("../models/courses/education"),
	Assignments = require("../models/courses/assigment"),
	Files = require("../models/file"),
	{ isAuth } = require("../middleware/auth/authorization");

/// Courses ROUTES ///

/**
 * todo
 * # Improved validations (more advanced),
 * # Permissions
 * 
 */
router.get("/", subject_list);

router.post("/", async (req, res, next) => {
	let ids_edu = req.body.education,
		name = req.body.name;
	fullpath = res.fullpath;

	// convert to array if not already an array
	if (!(ids_edu instanceof Array)) {
		if (typeof ids_edu === "undefined") ids_edu = [];
		else ids_edu = new Array(ids_edu);
	}

	let education = ids_edu.length >= 1 ? ids_edu : [];

	let subject = await new Subjects({
		name,
		education
	}).save();

	res.status(201).json({
		message: "Subject added",
		subject: {
			name: subject.name,
			education: subject.education,
			request: {
				type: "GET",
				url: `${fullpath}${subject._id}`
			}
		}
	});
});

// Delete All subjects
router.delete("/", (req, res, next) => {
	subjects
		.deleteMany()
		.exec()
		.then(doc => {
			doc.length > 0
				? res.status(200).json({
						message: "Al courses were succesfully deleted",
						courses: doc.deletedCount
					})
				: res.status(200).json({ message: "No Course to delete" });
		})
		.catch(err => {
			res.status(500).json({ message: err });
		});
});

///////////////////////////////////////////////

// Get single subject
router.get("/:id", async (req, res, next) => {
	let id = req.params.id,
		fullpath = res.fullpath;

	try {
		if (!mongoose.isValidObjectId(id)) {
			throw new Error("Invalid subject ID");
		}

		let tsk = Assignments.find({ subject: id }).select("type file description deadline"),
			sub = Subjects.findById(id).select("-__v"),
			subject_array = await Promise.all([ tsk, sub ]);

		let task = subject_array[0],
			subject = subject_array[1];

		if (!subject) {
			return res.status(404).json({ message: "Subject not found" });
		}

		res.status(200).json({
			subject,
			task,
			request: {
				type: "GET",
				description: "GET ALL subjects",
				url: fullpath.slice(0, -24)
			}
		});
	} catch (error) {
		res.status(500).json({
			message: "Something went wrong",
			error: error.message
		});
	}
});

// Update single course
router.patch("/:id", (req, res, next) => {
	let id = req.params.id;
	let bodyObject = new Object(req.body);
	let port = req.app.settings.port,
		origin = req.originalUrl,
		fullpath = `${req.protocol}://${req.hostname}:${port}${origin}`;

	// making sure only keys in the database are passed
	for (let obj in bodyObject) {
		if (!(obj in subjects.schema.paths)) delete bodyObject[obj];
	}

	subjects
		.findByIdAndUpdate(id, bodyObject, { useFindAndModify: false })
		.select("-__v")
		.exec()
		.then(doc => {
			res.status(200).json({
				before: doc,
				changed: bodyObject,
				reques: {
					type: "GET",
					url: origin.slice(-1) === "/" ? `${fullpath}${doc._id}` : `${fullpath}/${doc._id}`
				}
			});
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

// Delete single course
router.delete("/:id", async (req, res, next) => {
	let id = req.params.id;
	try {
		//- check if any assignments is linked to subject, if so, delete assignment aswell

		if (!mongoose.isValidObjectId(id)) {
			throw new Error("Invalid subject ID");
		}
		//Subject verwijderen
		let del_subject = await Subjects.findByIdAndDelete(id);
		let task_list = await Assignments.find({ subject: id });
		if (task_list.length >= 1) {
			let files_ids = "";
			task_list.forEach(file => {
				console.log("Assignments:", file);
				files_ids = file.file;
			});
			console.log("###", files_ids);
			await Assignments.deleteMany({ subject: id });
			let errors = [];
			if (files_ids.length >= 1) {
				try {
					files_ids.forEach(async file_id => {
						file = await Files.findById(file_id);
						console.log("FILES &: ", file);
						if (file) {
							if (fs.existsSync(file.url)) {
								fs.unlink(file.url, err => {
									if (err) errors.push({ message: err });
								});
							} else {
								errors.push({ message: `File: ${file.url} doesn't exist` });
							}
							await Files.findByIdAndDelete(file_id);
						} else {
							errors.push({ message: `File: doesn't exist` });
						}
					});
				} catch (error) {
					errors.push({ message: err });
				}
			}
			if (errors.length >= 1) {
				//! misschien toegevoegde bestanden ook mee verwijderen?
				return res.status(500).json({
					message: "Something went wrong",
					err: errors
				});
			}
		}

		if (!del_subject) return res.status(404).json({ message: "Course not found to delete" });
		res.status(200).json({ message: "Subject was succesfully deleted", deleted: del_subject });
	} catch (err) {
		res.status(500).json({
			message: "Something went wrong",
			error: err.message
		});
	}
});

module.exports = router;
