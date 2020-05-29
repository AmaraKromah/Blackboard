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
				expiresIn: expiresIn
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
				file = await Files.findById(file_id).select("url");
				console.log("FILES: ", file);
				if (file) {
					if (fs.existsSync(file.url)) {
						fs.unlink(file.url, err => {
							if (err) errors.push({ message: err });
						});
					} else {
						errors.push({ message: `Filepath: ${file.url} doesn't exist` });
					}
					await Files.findByIdAndDelete(file_id);
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
	check_valid_sub_id: (req, res, next) => {
		if (!mongoose.isValidObjectId(req.params.sub_id)) {
			return res.status(500).json({ error: "Subject ID is not valid" });
		}
		next();
	}
};

//- misschien file verwijderen aan toevoegen
module.exports = methods;
