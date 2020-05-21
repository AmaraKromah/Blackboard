const multer = require("multer");
const MIME_TYPE_MAP = require("./mime").MIME_TYPE_FILE;

//todo update allowed file types 

const storage = multer.diskStorage({
		destination: function(req, file, cb){
			// Uploads is the Upload_folder_name
			cb(null, "./public/documents/assignments");
		},
		filename: (req, file, cb) => {
			let name = file.originalname.toLowerCase().split(" ").join("_");
			if (name.split(".").length > 1) {
				let tempName = name.split(".");
				tempName.pop();
				name = tempName.join(".");
			}
			name += "_" + Date.now();
			const ext = MIME_TYPE_MAP[file.mimetype];
			cb(null, name + "." + ext);
		}
	}),
	fileFilter = (req, file, cb) => {
		const isValid = MIME_TYPE_MAP[file.mimetype];
		if (isValid) {
			cb(null, true);
		} else {
			cb(`INVALID FILE TYPE ${file.mimetype}`, false);
		}
	};

module.exports = ({ fileSize, fieldName, fieldNameSize, maxFilesAmount }) => {
	return (req, res, next) => {
		multer({
			storage: storage,
			fileFilter: fileFilter,
			limits: {
				fileSize: 1024 * 1024 * parseInt(fileSize), // filesizer is in bytes => 5mb
				fieldNameSize: fieldNameSize,
			}
		}).array(fieldName,maxFilesAmount)(req, res, function(err){
			// console.log("FILE: ", req.files);
			if (err instanceof multer.MulterError) {
				return res.status(500).json({
					message: err.message,
					error_code: err.code
				});
			} else if (err) {
				return res.status(500).json({
					message: err
				});
			}
			next();
		});
	};
};
