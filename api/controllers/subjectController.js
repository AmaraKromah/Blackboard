const mongoose = require("mongoose");

const Subjects = require("../models/courses/subject"),
	Assignments = require("../models/courses/assigment");
const { remove_files } = require("../helpers/re_useables/reuse");

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
						_id: doc._id,
						name: doc.name,
						request: {
							type: "GET",
							url: origin.slice(-1) === "/" ? `${fullpath}${doc._id}` : `${fullpath}/${doc._id}`,
						},
					};
				}),
			};
			res.status(200).json(response);
		} else {
			return res.status(200).json({ message: "No subject exist", subject: subjects_list });
		}
	} catch (error) {
		res.status(500).json({
			messsage: "Something went wrong",
			error: error.message,
		});
	}
};

// Create course (POST /)..
exports.subject_create = async (req, res, next) => {
	let ids_edu = req.body.education,
		name = req.body.name;
	fullpath = res.fullpath;

	let teacher = res.user_id;
	console.log(teacher);

	// convert to array if not already an array
	if (!(ids_edu instanceof Array)) {
		if (typeof ids_edu === "undefined") ids_edu = [];
		else ids_edu = new Array(ids_edu);
	}

	let education = ids_edu.length >= 1 ? ids_edu : [];

	console.log("edu ", education);
	let subject = await new Subjects({
		name,
		education,
		// teacher,
	}).save();

	res.status(201).json({
		message: "Subject added",
		subject: {
			_id: subject._id,
			name: subject.name,
			education: subject.education,
			request: {
				type: "GET",
				url: String(fullpath).slice(-1) === "/" ? `${fullpath}${subject._id}` : `${fullpath}/${subject._id}`,
			},
		},
	});
};

// Display details for one course (GET /:id).
exports.subject_details = async (req, res, next) => {
	let id = req.params.id,
		fullpath = res.fullpath;

	try {
		if (!mongoose.isValidObjectId(id)) {
			throw new Error("Invalid subject ID");
		}

		let tsk = Assignments.find({ subject: id }).select("title type description file"),
			sub = Subjects.findById(id).select("-__v"),
			subject_array = await Promise.all([tsk, sub]);
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
				url: fullpath.slice(0, -24),
			},
		});
	} catch (error) {
		res.status(500).json({
			message: "Something went wrong",
			error: error.message,
		});
	}
};

// Update course (PATCH /:id)..
exports.subject_update = function (req, res, next) {};

// Delete course (DELETE /:id)..
exports.subject_delete = async (req, res, next) => {
	let id = req.params.id;
	try {
		//- check if any assignments is linked to subject, if so, delete assignment aswell

		if (!mongoose.isValidObjectId(id)) {
			throw new Error("Invalid subject ID");
		}
		//Subject verwijderen
		const subj = Subjects.findById(id);
		const task = Assignments.find({ subject: id });
		let subject_list = await Promise.all([subj, task]);
		let del_subject = subject_list[0];
		let task_list = subject_list[1];

		if (!del_subject) return res.status(404).json({ message: "Course not found to delete" });

		if (task_list.length >= 1) {
			let files_ids = [];
			task_list.forEach(file => {
				files_ids.push(file.file);
			});
			files_ids = [].concat(...files_ids);
			console.log("Files ID'S: ", files_ids);

			let errors = "";
			if (files_ids.length >= 1) {
				errors = remove_files({ files_ids: files_ids });
			}
			if (errors.length >= 1) {
				return res.status(500).json({
					message: "Something went wrong",
					err: errors,
				});
			}
		}
		const del_subj = Subjects.findByIdAndDelete(id);
		const del_task = Assignments.deleteMany({ subject: id });
		await Promise.all([del_subj, del_task]);

		res.status(200).json({ message: "Subject was succesfully deleted", deleted: del_subject });
	} catch (err) {
		res.status(500).json({
			message: "Something went wrong",
			error: err.message,
		});
	}
};
