const bcrypt = require("bcrypt"),
	jwt = require("jsonwebtoken"),
	async = require("async");

//* Models needed
const Assignments = require("../models/courses/assigment"),
	Subjects = require("../models/courses/subject"),
	Files = require("../models/file");

//# Get all request

// Get all assigments
exports.assignments_list = async (req, res) => {
	let origin = req.originalUrl,
		fullpath = res.fullpath;

	try {
		assigment = await Assignments.find().populate("file", "_id");

		// If none exist
		if (!assigment.length > 0) {
			return res.status(200).json({ message: "No Assigments exist", assigments: assigment });
		}

		let response = {
			message: "Feched all data",
			count: assigment.length,
			assigments: assigment.map(doc => {
				return {
					title: doc.title,
					description: doc.type,
					type: doc.type,
					file: doc.file,
					subject: doc.subject,
					teacher: doc.teacher,
					deadline: doc.deadline,
					send_at: doc.send_at,
					changed_at: doc.changed_at,
					request: {
						type: "GET",
						url: origin.slice(-1) === "/" ? `${fullpath}${doc._id}` : `${fullpath}/${doc._id}`
					}
				};
			})
		};

		res.status(200).json(response);
	} catch (error) {
		res.status(500).json({
			message: "Something went wrong",
			error: error.message
		});
	}
};

exports.assignments_create = async (req, res, next) => {
	try {
		let files = req.files;
		let teacher = res.userData;
		let files_id = [];

		if (files.length >= 1) {
			for (let file of files) {
				console.log("element", file);

				new_file = await new Files({
					name: file.filename,
					url: file.path,
					ext: file.filename.split(".").pop(),
					type: file.mimetype
				}).save();

				files_id.push(new_file._id);
			}
		}

		let file = files_id.length >= 1 ? files_id : [];

		let new_assigment = await new Assignments({
			title: req.body.title,
			description: req.body.description,
			type: req.body.type,
			file: file,
			subject: req.body.subject,
			teacher: teacher.id,
			deadline: req.body.deadline
		}).save();

		res.status(201).json({
			message: "Assigment Created",
			assigment: new_assigment
		});
	} catch (error) {
		res.status(500).json({
			message: "Something went wrong",
			error: error.message
		});
	}
};


exports.assigments_delete_list = async (req, res, next)=>{

};