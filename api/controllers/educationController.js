const mongoose = require("mongoose");
const Educations = require("../models/courses/education"),
	Subjects = require("../models/courses/subject"),
	Assignments = require("../models/courses/assigment");
const { remove_files } = require("../helpers/re_useables/reuse");

// Display list of all Courses (GET /).
exports.education_list = async (req, res, next) => {
	let origin = res.origin,
		fullpath = res.fullpath;

	try {
		edu = await Educations.find().exec();
		if (!edu.length >= 1) return res.status(200).json({ message: "No Education exist", education: edu });

		let response = {
			message: "Feched all data",
			count: edu.length,
			educations: edu.map(doc => {
				return {
					name: doc.name,
					_id: doc._id,
					begin_date: doc.begin_date,
					end_date: doc.end_date,
					total_years: doc.years,
					request: {
						type: "GET",
						url: origin.slice(-1) === "/" ? `${fullpath}${doc._id}` : `${fullpath}/${doc._id}`,
					},
				};
			}),
		};
		res.status(200).json(response);
	} catch (error) {
		res.status(500).json({ message: "Something went wrong", error: error.message });
	}
};

// Create education (POST /)..
exports.education_create = async (req, res, next) => {
	let origin = res.origin,
		fullpath = res.fullpath;
	console.log("Dates begin: ", req.body.begin_date, "\nend: ", req.body.end_date);
	try {
		let edu = await new Educations({
			name: req.body.name,
			begin_date: req.body.begin_date,
			end_date: req.body.end_date,
		}).save();
		res.status(201).json({
			message: "Education added",
			edu,
			request: {
				type: "GET",
				url: origin.slice(-1) === "/" ? `${fullpath}${edu._id}` : `${fullpath}/${edu._id}`,
			},
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

/////////////////////////////////////////////////////////////

// Display details for one course (GET /:id).
exports.education_detail = async (req, res, next) => {
	let id = req.params.id,
		fullpath = res.fullpath;

	if (!mongoose.isValidObjectId(id)) return res.status(500).json({ message: "Something went wrong", error: "Invalid education ID" });

	try {
		let education = Educations.findById(id),
			subj = Subjects.find({ education: id }).select("_id name"),
			edu_list = await Promise.all([education, subj]),
			edu = edu_list[0],
			subject_list = edu_list[1];
		task_list = await Assignments.find({ subject: { $in: subject_list } });

		if (!edu) return res.status(404).json({ message: "Education not found" });
		let response = {
			education: new Array(edu).map(doc => {
				return {
					_id: doc._id,
					name: doc.name,
					begin_date: doc.begin_date,
					end_date: doc.end_date,
					years: doc.years,
					subject: subject_list.map(subj => {
						return {
							_id: subj._id,
							name: subj.name,
							assignment: task_list
								.filter(task => {
									return String(task.subject) === String(subj._id);
								})
								.map(task => {
									return {
										_id: task._id,
										title: task.title,
										file: task.file,
									};
								}),
						};
					}),
				};
			}),
		};

		res.status(200).json({
			response,
			request: {
				type: "GET",
				description: "GET ALL educations",
				url: String(fullpath).slice(0, -24),
			},
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Update single education (PATCH /:id).
exports.education_update = async (req, res, next) => {
	let fullpath = res.fullpath;
	let id = req.params.id;
	console.log("ID", id);

	let body_update = {
		name: req.body.name,
		begin_date: req.body.begin_date,
		end_date: req.body.end_date,
	};
	console.log("BODY: ", body_update);
	if (!mongoose.isValidObjectId(id)) return res.status(500).json({ message: "Something went wrong", error: "Invalid education ID" });
	try {
		let edu = await Educations.findByIdAndUpdate(id, body_update, { useFindAndModify: false }).select("-__v");

		res.status(200).json({
			before: edu,
			changed: body_update,
			reques: {
				type: "GET ",
				url: fullpath,
			},
		});
	} catch (error) {
		res.status(500).json({ message: "Something went wrong", error: error.message });
	}
};

// Delete single education (DELETE /:id)..
exports.education_delete = async (req, res, next) => {
	let fullpath = res.fullpath;
	console.log("I'm requestes");
	let id = req.params.id;

	if (!mongoose.isValidObjectId(id)) return res.status(500).json({ message: "Something went wrong", error: "Invalid education ID" });
	try {
		let education = Educations.findById(id),
			subj = Subjects.find({ education: id }).select("_id"),
			edu_list = await Promise.all([education, subj]),
			edu = edu_list[0],
			subject_list = edu_list[1];

		if (!edu) return res.status(404).json({ message: "Education not found to delete" });

		task_list = "";
		if (subject_list.length >= 1) task_list = await Assignments.find({ subject: { $in: subject_list } });

		if (task_list.length >= 1) {
			let files_ids = [];
			task_list.forEach(file => {
				console.log("task: ", file);
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

		const del_edu = Educations.findByIdAndDelete(id);
		const del_subj = Subjects.deleteMany({ education: id });
		const del_task = Assignments.deleteMany({ subject: { $in: subject_list } });
		await Promise.all([del_edu, del_subj, del_task]);
		res.status(200).json({
			message: "Education was succesfully deleted",
			deleted: edu,
			request: {
				type: "POST",
				description: "To add new courses ",
				url: fullpath.slice(0, -24),
				syntax: {
					name: "String",
				},
			},
		});
	} catch (error) {
		res.status(500).json({ message: "Something went wrong", error: error.message });
	}
};

// Delete all educations (Delete /)
exports.education_delete_list = function (req, res, next) {
	Educations.deleteMany()
		.exec()
		.then(doc => {
			res.status(200).json({
				message: "Al educations were succesfully deleted",
				deleted_count: doc.deletedCount,
			});
		})
		.catch(err => {
			res.status(500).json({ message: err });
		});
};
