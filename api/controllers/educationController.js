const educations = require("../models/courses/education");
// mongoose = require('mongoose');

// Display list of all Courses (GET /).
exports.education_list = function(req, res, next){
	let port = req.app.settings.port,
		origin = req.originalUrl,
		fullpath = `${req.protocol}://${req.hostname}:${port}${origin}`;
	educations
		.find()
		.exec()
		.then(docs => {
			if (docs.length > 0) {
				let response = {
					message: "Feched all data",
					count: docs.length,
					educations: docs.map(doc => {
						return {
							name: doc.name,
							_id: doc._id,
							request: {
								type: "GET",
								url: origin.slice(-1) === "/" ? `${fullpath}${doc._id}` : `${fullpath}/${doc._id}`
							}
						};
					})
				};
				res.status(200).json(response);
			} else {
				res.status(200).json({ message: "No Education exist", education: docs });
			}
		})
		.catch(err => {
			res.status(500).json({ error: err });
		});
};

// Create education (POST /)..
exports.education_create = function(req, res, next){
	const education = new educations({
		name: req.body.name
	});
	let port = req.app.settings.port,
		origin = req.originalUrl,
		fullpath = `${req.protocol}://${req.hostname}:${port}${origin}`;
	education
		.save()
		.then(result => {
			res.status(201).json({
				message: "Education added",
				education: {
					name: result.name,
					request: {
						type: "GET",
						url: origin.slice(-1) === "/" ? `${fullpath}${result._id}` : `${fullpath}/${result._id}`
					}
				}
			});
		})
		.catch(err => {
			res.status(500).json({ error: err });
		});
};

// Delete all educations (Delete /)
exports.education_delete_list = function(req, res, next){
	educations
		.deleteMany()
		.exec()
		.then(doc => {
			res.status(200).json({
				message: "Al educations were succesfully deleted",
				deleted_count: doc.deletedCount
			});
		})
		.catch(err => {
			res.status(500).json({ message: err });
		});
};

/////////////////////////////////////////////////////////////

// Display details for one course (GET /:id).
exports.education_detail = function(req, res, next){
	let id = req.params.id;
	let port = req.app.settings.port,
		origin = req.originalUrl,
		fullpath = `${req.protocol}://${req.hostname}:${port}${origin}`;

	educations
		.findById(id)
		.select("-__v")
		.exec()
		.then(doc => {
			if (doc) {
				res.status(200).json({
					courses: doc,
					request: {
						type: "GET",
						description: "GET ALL educations",
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
};

// Update single education (PATCH /:id).
exports.education_update = function(req, res, next){
	let id = req.params.id;
	let bodyObject = new Object(req.body);

	let port = req.app.settings.port,
		origin = req.originalUrl,
		fullpath = `${req.protocol}://${req.hostname}:${port}${origin}`;

	// making sure only keys in the database are passed
	for (let obj in bodyObject) {
		if (!(obj in educations.schema.paths)) delete bodyObject[obj];
	}
	educations
		.findByIdAndUpdate(id, bodyObject, { useFindAndModify: false })
		.select("-__v")
		.exec()
		.then(doc => {
			console.log(origin);
			res.status(200).json({
				before: doc,
				changed: bodyObject,
				reques: {
					type: "GET ",
					url: fullpath
				}
			});
		})
		.catch(err => {
			res.status(500).json(err);
		});
};

// Delete single education (DELETE /:id)..
exports.education_delete = function(req, res, next){
	let id = req.params.id;

	// dit kan misschien in een globale variabele
	let port = req.app.settings.port,
		origin = req.originalUrl,
		fullpath = `${req.protocol}://${req.hostname}:${port}${origin}`;

	educations
		.findByIdAndDelete(id)
		.select("-__v")
		.exec()
		.then(result => {
			if (result) {
				res.status(200).json({
					deleted: result,
					request: {
						type: "POST",
						description: "To add new courses ",
						url: fullpath.slice(0, -24),
						syntax: {
							name: "String"
						}
					}
				});
			} else {
				res.status(404).json({ message: "Education not found to delete" });
			}
		})
		.catch(err => {
			res.status(500).json({ error: err });
		});
};
