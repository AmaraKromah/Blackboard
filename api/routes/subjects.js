const express = require("express"),
	router = express.Router();

const courses_controller = require("../controllers/coursesController");

let subjects = require("../models/courses/subject"),
	educations = require("../models/courses/education");

/// Courses ROUTES ///

router.get("/", courses_controller.course_list);

router.post("/", (req, res, next) => {
	let ids_edu = req.body.education;

	// Making sure given input is an Array
	if (!(ids_edu instanceof Array)) {
		if (typeof ids_edu === "undefined") ids_edu = [];
		else ids_edu = new Array(ids_edu);
	}

	educations
		.find({ _id: { $in: ids_edu } })
		.select("-__v")
		.exec()
		.then(result => {
			if (result.length > 0) {
				// Making sure only the right ID's are passed. this may not be needed client level
				ids_edu.length = 0;
				result.forEach(item => {
					ids_edu.push(item._id);
				});

				const course = new subjects({
					name: req.body.name,
					points: req.body.points,
					education: ids_edu
				});
				return course.save(); // hiermee gaat de volgende then aan de slag
			}
		})
		// Output van hierboven word in  "Results" van de volgende then gestoken
		.then(result => {
			if (!result) {
				// Als result leeg is wil het zeggen dat we ze hierboven niet konden opvullen
				return res.status(404).json({ error: "Education not found" });
			}
			let port = req.app.settings.port,
				origin = req.originalUrl,
				fullpath = `${req.protocol}://${req.hostname}:${port}${origin}`;
			res.status(201).json({
				message: "Course added",
				course: {
					name: result.name,
					points: result.points,
					education: result.education,
					request: {
						type: "GET",
						url: `${fullpath}${result._id}`
					}
				}
			});
		})
		// Elke error dat een van de bovenstaande then uitgeeft word door deze then opgevangen
		.catch(err => {
			res.status(500).json({ error: err });
		});
});

// Delete All Courses
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

// Get single course
router.get("/:id", (req, res, next) => {
	let id = req.params.id;
	let port = req.app.settings.port,
		origin = req.originalUrl,
		fullpath = `${req.protocol}://${req.hostname}:${port}${origin}`;

	subjects
		.findById(id)
		.select("-__v")
		.populate("education", "-__v")
		.exec()
		.then(doc => {
			if (doc) {
				res.status(200).json({
					courses: doc,
					request: {
						type: "GET",
						description: "GET ALL courses",
						url: fullpath.slice(0, -24)
					}
				});
			} else {
				res.status(404).json({ message: "Course not found" });
			}
		})
		.catch(err => {
			res.status(500).json({ error: err });
		});
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
router.delete("/:id", (req, res, next) => {
	let id = req.params.id;
	subjects
		.findByIdAndDelete(id)
		.exec()
		.then(result => {
			if (result) {
				console.log(`Deleted ${result.name} with ID ${result._id} `);
				res.status(200).json({ deleted: result });
			} else {
				console.log(`${id} does not exist`);
				res.status(404).json({ message: "Course not found to delete" });
			}
		})
		.catch(err => {
			res.status(500).json({ error: err });
		});
});

module.exports = router;
