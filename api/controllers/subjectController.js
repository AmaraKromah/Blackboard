const Subjects = require("../models/courses/subject");

// Display list of all Courses (GET /).
exports.course_list = function(req, res, next){
	let port = req.app.settings.port,
		origin = req.originalUrl,
		fullpath = `${req.protocol}://${req.hostname}:${port}${origin}`;

	Subjects.find()
		.populate("education", "-__v")
		.exec()
		.then(docs => {
			if (docs.length > 0) {
				let response = {
					message: "Feched all data",
					count: docs.length,
					courses: docs.map(doc => {
						return {
							name: doc.name,
							points: doc.points,
							education: doc.education,
							request: {
								type: "GET",
								url: origin.slice(-1) === "/" ? `${fullpath}${doc._id}` : `${fullpath}/${doc._id}`
							}
						};
					})
				};
				res.status(200).json(response);
			} else {
				res.status(200).json({ message: "No Course exist", courses: docs });
			}
		})
		.catch(err => {
			console.log("error", err);
			res.status(500).json({ error: err });
		});
};

// Create course (POST /)..
exports.course_create = function(req, res, next){};

// Display details for one course (GET /:id).
exports.course_details = function(req, res, next){};

// Update course (PATCH /:id)..
exports.course_update = function(req, res, next){};

// Delete course (DELETE /:id)..
exports.course_delete = function(req, res, next){};
