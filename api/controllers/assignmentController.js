//assigments controller
const bcrypt = require("bcrypt"),
	jwt = require("jsonwebtoken"),
	async = require("async"),
	fs = require("fs");

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
		assigment = await Assignments.find().populate("file", "_id url");

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

// todo permission checking
exports.assigments_update = async (req, res, next) => {
	let id = req.params.id;
	let files = req.files;
	// let teacher = res.userData; // todo teacher's ID
	let files_id = [];

	//# files
	// - find assignment first

	task = await Assignments.findById(id).populate("file", "_id url ");
	task_files = task.file;

	// - Delete exsisting files in public folder
	if (files.length >= 1) {
		let errors = [];
		try {
			task_files.forEach(async file => {
				if (fs.existsSync(file.url)) {
					// - Delete file in public folder
					fs.unlink(file.url, error => {
						if (error) errors.push({ message: error });
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
		// //- Adding new (updated) file if any
		let old_files_id = task_files.map(file => file._id);
		if (files.length >= 1) {
			await Files.deleteMany({ _id: { $in: old_files_id } });

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
		let file = files_id.length >= 1 ? files_id : old_files_id;
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
};

//-error handling
exports.assigments_delete = async (req, res, next) => {
	let id = req.params.id;
	let files_ids = req.body.file;
	let only_files = req.body.file_only;

	//- convert files to array just in case
	if (!(files_ids instanceof Array)) {
		if (typeof files_ids === "undefined") files_ids = [];
		else files_ids = new Array(files_ids);
	}

	//- delete  assignment only if only_files (only files should be deleted and not the assigments itself)
	if (only_files === "false") {
		try {
			await Assignments.findByIdAndDelete(id);
		} catch (error) {
			return res.status(500).json({
				message: "Something went wrong",
				err: error
			});
		}
	}
	//- delete all files_ids if any
	let errors = [];
	if (files_ids.length >= 1) {
		//-delete files
		try {
			files_ids.forEach(async file_id => {
				//-check if input is a Object ID
				if (String(file_id).match(/^[0-9a-fA-F]{24}$/)) {
					file = await Files.findById(file_id);
					if (file) {
						// -File exsist in public folder
						if (fs.existsSync(file.url)) {
							// - Delete file in public folder
							fs.unlink(file.url, err => {
								if (err) errors.push({ message: err });
							});
						} else {
							errors.push({ message: `File: ${file.url} doesn't exist` });
						}
						// - delete file in db
						await Files.findByIdAndDelete(file_id);
					} else {
						errors.push({ message: `File: doesn't exist` });
					}
				}
			});
		} catch (err) {
			errors.push({ message: err });
		}
	}

	if (errors.length >= 1) {
		//! misschien toegevoegde bestanden ook mee verwijderen?
		return res.status(500).json({
			message: "Something went wrong",
			err: errors
		});
		return res.status(202).json({
			message: "Removal succesfull"
		});
	}
};

// exports.assigments_delete_list = async (req, res, next) => {};
