const express = require("express"),
	router = express.Router({ mergeParams: true });

// const fetch = require("node-fetch");
const mongoose = require("mongoose"),
	fs = require("fs");

const { subject_list, subject_create, subject_details, subject_delete } = require("../controllers/subjectController");

const Subjects = require("../models/courses/subject"),
	Assignments = require("../models/courses/assigment"),
	Files = require("../models/file"),
	{ authenticate } = require("../middleware/auth/authorization");

/// Courses ROUTES ///

/**
 * todo
 * # Improved validations (more advanced),
 * # Permissions
 *
 */
router.get("/", authenticate, subject_list);

router.post("/", authenticate, subject_create);

///////////////////////////////////////////////

// Get single subject
router.get("/:id", subject_details);

// Update single course
//! nog testen
router.patch("/:id", async (req, res, next) => {
	let id = req.params.id;
	let bodyObject = new Object(req.body);
	origin = String(res.origin);
	fullpath = res.fullpath;

	// let update = {
	// 	name: req.body.name,

	// }
	for (let obj in bodyObject) {
		if (!(obj in Subjects.schema.paths)) delete bodyObject[obj];
	}
	try {
		if (!mongoose.isValidObjectId(id)) {
			throw new Error("Invalid subject ID");
		}

		let tsk = Assignments.find({ subject: id }).select("type file description deadline"),
			sub = Subjects.findByIdAndUpdate(id, bodyObject, { useFindAndModify: false }).select("-__v");
		subject_array = await Promise.all([tsk, sub]);

		let task = subject_array[0],
			subject = subject_array[1];

		res.status(200).json({
			before: { subject, task },
			changed: bodyObject,
			reques: {
				type: "GET",
				url: `${fullpath}${subject._id}`,
			},
		});
	} catch (error) {
		res.status(500).json(error.message);
	}
});

// Delete single course
router.delete("/:id", subject_delete);

// Delete All subjects
//# Later
router.delete("/", (req, res, next) => {
	subjects
		.deleteMany()
		.exec()
		.then(doc => {
			doc.length > 0
				? res.status(200).json({
						message: "Al courses were succesfully deleted",
						courses: doc.deletedCount,
				  })
				: res.status(200).json({ message: "No Course to delete" });
		})
		.catch(err => {
			res.status(500).json({ message: err });
		});
});
module.exports = router;
