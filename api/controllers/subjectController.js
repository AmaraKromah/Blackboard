const async = require("async");
const Subjects = require("../models/courses/subject");

// Display list of all Courses (GET /).
exports.subject_list = async (req, res, next) => {	
	let origin = req.originalUrl,
		fullpath = res.fullpath;
	try {
		subjects_list = await Subjects.find();
		if (subjects_list.length >= 1) {
			let response = {
				message: "Feched all data",
				count: subjects_list.length,
				subjects: subjects_list.map(doc => {
					return {
						name: doc.name,
						request: {
							type: "GET",
							url: origin.slice(-1) === "/" ? `${fullpath}${doc._id}` : `${fullpath}/${doc._id}`
						}
					};
				})
			};
			res.status(200).json(response);
		} else {
			return res.status(200).json({ message: "No subject exist", subject: subjects_list });
		}
	} catch (error) {
		res.status(500).json({
			messsage: "Something went wrong",
			error: error.message
		});
	}
};

// Create course (POST /)..
exports.subject_create = function(req, res, next){};

// Display details for one course (GET /:id).
exports.subject_details = function(req, res, next){};

// Update course (PATCH /:id)..
exports.subject_update = function(req, res, next){};

// Delete course (DELETE /:id)..
exports.subject_delete = function(req, res, next){};
