const bcrypt = require("bcrypt"),
	jwt = require("jsonwebtoken"),
	mongoose = require("mongoose"),
	fs = require("fs");

const Files = require("../../models/file");

// JWT token

var methods = {
	create_token: ({ info, JWT_KEY, expiresIn }) => {
		try {
			let token = jwt.sign(info, JWT_KEY, {
				expiresIn: expiresIn,
			});
			return token;
		} catch (error) {
			return error.message;
		}
	},

	consume_token: ({ token, JWT_KEY }) => {
		try {
			const decoded = jwt.verify(token, JWT_KEY);
			return decoded;
		} catch (error) {
			return error.message;
		}
	},
	remove_files: async ({ files_ids, Model_ref, _id }) => {
		let errors = [];
		const try_remove_files = files_ids.map(async file_id => {
			try {
				if (!mongoose.isValidObjectId(file_id)) {
					errors.push({ message: ` ${file_id}: is an invalid file ID` });
				}
				file = await Files.findById(file_id).select("path");
				console.log("FILES: ", file);
				if (file) {
					if (fs.existsSync(file.path)) {
						fs.unlink(file.path, err => {
							if (err) errors.push({ message: err });
						});
					} else {
						errors.push({ message: `Filepath: ${file.path} doesn't exist` });
					}
					await Files.findByIdAndDelete(file_id);
					// if (Model_ref) await Model_ref.updateOne({ _id }, { $pull: { file: file_id } });
					if (Model_ref) await Model_ref.findByIdAndUpdate(_id, { $pull: { file: file_id } }, { useFindAndModify: false });
				} else {
					errors.push({ message: `Couldn't find file` });
				}
			} catch (error) {
				errors.push({ message: error.message });
			}
		});
		await Promise.all(try_remove_files);

		return errors;
	},
};

//- misschien file verwijderen aan toevoegen
module.exports = methods;
