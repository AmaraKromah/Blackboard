//assigments controller
const bcrypt = require("bcrypt"),
	jwt = require("jsonwebtoken"),
	async = require("async"),
	fs = require("fs");
const mongoose = require("mongoose");

//* Models needed
const Assignments = require("../models/courses/assigment"),
	Subjects = require("../models/courses/subject"),
	Files = require("../models/file");
const { remove_files } = require("../helpers/re_useables/reuse");

//# Get all request

// Get all assigments
exports.assignments_list = async (req, res) => {
	let origin = req.originalUrl,
		fullpath = res.fullpath;

	try {
		assigment = await Assignments.find().populate("file", "_id name url");

		// If none exist
		if (!assigment.length >= 1) return res.status(200).json({ message: "No Assigments exist", assigments: assigment });

		let response = {
			message: "Feched all data",
			count: assigment.length,
			assigments: assigment.map(doc => {
				return {
					_id: doc._id,
					title: doc.title,
					description: doc.description,
					type: doc.type,
					file: doc.file,
					subject: doc.subject,
					teacher: doc.teacher,
					deadline: doc.deadline,
					send_at: doc.send_at,
					changed_at: doc.changed_at,
					request: {
						type: "GET",
						url: origin.slice(-1) === "/" ? `${fullpath}${doc._id}` : `${fullpath}/${doc._id}`,
					},
				};
			}),
		};

		res.status(200).json(response);
	} catch (error) {
		res.status(500).json({
			message: "Something went wrong",
			error: error.message,
		});
	}
};

exports.assignments_create = async (req, res, next) => {
	try {
		let files = req.files;
		teacher = res.userData;
		files_id = [];

		if (files) {
			if (files.length >= 1) {
				for (let file of files) {
					file_path = res.hostname + String(file.path).replace(/\\/g, "/").slice(6);
					new_file = await new Files({
						name: file.filename,
						path: file.path,
						url: file_path,
						ext: file.filename.split(".").pop(),
						type: file.mimetype,
					}).save();

					files_id.push(new_file._id);
				}
			}
		}

		let file = files_id.length >= 1 ? files_id : [];
		subject = typeof req.body.subject === "undefined" ? req.body.subject : null;
		let new_assigment = await new Assignments({
			title: req.body.title,
			description: req.body.description,
			type: req.body.type,
			file: file,
			subject,
			// teacher: teacher.id,
			deadline: req.body.deadline,
		}).save();

		res.status(201).json({
			message: "Assigment Created",
			assigment: new_assigment,
		});
	} catch (error) {
		res.status(500).json({
			message: "Something went wrong 1",
			error: error.message,
		});
	}
};

// todo permission checking
exports.assigments_update = async (req, res, next) => {
	// let teacher = res.userData; // todo teacher's ID

	let id = req.params.id,
		files = req.files,
		replace_current = req.body.replaceCurrent,
		files_id = [];
	// convert to array
	// files
	//  find assignment first
	//todo maak een uitzondering op bestanden dat niet gewijzigd zijn

	task = await Assignments.findById(id).populate("file", "_id path ");
	task_files = task.file;
	// //! check of bestand aanwezig is in de niet gewijzigd lijst

	// - Delete exsisting files in public folder
	if (replace_current != "undefined" && String(replace_current).toLowerCase() === "true") {
		if (files.length >= 1) {
			let errors = [];
			// todo reuse gebruiken
			try {
				task_files.forEach(async file => {
					if (fs.existsSync(file.path)) {
						// - Delete file in public folder
						fs.unlink(file.path, error => {
							if (error) errors.push({ message: error });
						});
					} else {
						errors.push({ message: `File: ${file.path} doesn't exist` });
					}
				});
			} catch (error) {
				errors.push({ message: error.message });
			}
			if (errors.length >= 1) {
				//! misschien toegevoegde bestanden ook mee verwijderen?
				return res.status(500).json({
					message: "Something went wrong 1",
					err: errors,
				});
			}
		}
	}

	// - Delete exsisting files in database
	try {
		// //- Adding new (updated) file if any
		let old_files_id = task_files.map(file => file._id);
		if (files.length >= 1) {
			if (replace_current != "undefined" && String(replace_current).toLowerCase() === "true") {
				try {
					await Files.deleteMany({ _id: { $in: old_files_id } });
				} catch (error) {
					return res.status(500).json({
						message: "Something went wrong 2",
						error: error.message,
					});
				}
			}

			for (let file of files) {
				url = res.hostname + String(file.path).replace(/\\/g, "/").slice(6);
				new_file = await new Files({
					name: file.filename,
					path: file.path,
					url,
					ext: file.filename.split(".").pop(),
					type: file.mimetype,
				}).save();

				files_id.push(new_file._id);
			}
		}
		// //# Assignment
		// // Updating Assignment
		// //! misschien files leeglaten als niks opgegeven is
		let file = files_id.length >= 1 ? files_id : old_files_id;
		if (replace_current != "undefined" && String(replace_current).toLowerCase() === "false") {
			file.push(...old_files_id);
		}

		let update_task = {
			title: req.body.title,
			description: req.body.description,
			type: req.body.type,
			file: file,
			// teacher: teacher.id,
			deadline: req.body.deadline,
		};
		updated_assignment = await Assignments.findByIdAndUpdate(id, update_task, { useFindAndModify: false });
		return res.status(200).json({
			message: "Updating Assigment",
			current_assignment: task,
			updated_assignment: update_task,
		});
	} catch (error) {
		return res.status(500).json({
			message: "Something went wrong 3",
			error: error.message,
		});
	}
};

//-error handling
exports.assigments_delete = async (req, res, next) => {
	let id = req.params.id;
	let files_ids = req.body.files_ids;
	let delete_task = req.body.delete_task;
	if (!(files_ids instanceof Array)) {
		if (typeof files_ids === "undefined") files_ids = [];
		else files_ids = new Array(files_ids);
	}
	if (!(await Assignments.findById(id))) return res.status(404).json({ message: "NO assignment with such ID" });

	// //- delete  assignment only if only_files (only files should be deleted and not the assigments itself)
	if (delete_task) {
		try {
			await Assignments.findByIdAndDelete(id);
		} catch (error) {
			return res.status(500).json({
				message: "Something went wrong 1",
				err: error.message,
			});
		}
	}
	//- delete all files_ids if any
	let errors = "";
	if (files_ids.length >= 1) {
		errors = await remove_files({ files_ids: files_ids, Model_ref: Assignments, _id: id });
	}
	if (errors.length >= 1) {
		return res.status(500).json({
			message: "Something went wrong 2",
			error: errors,
		});
	}
	return res.status(202).json({
		message: "Removal succesfull",
	});
};

// exports.assigments_delete_list = async (req, res, next) => {};
