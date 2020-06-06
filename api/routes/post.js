//# for angular testing
const express = require("express"),
	router = express.Router();

const multer = require("multer");
const MIME_TYPE_MAP = {
	"image/png": "png",
	"image/jpeg": "jpg",
	"image/jpg": "jpg",
};

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const isValid = MIME_TYPE_MAP[file.mimetype];
		let error = new Error("Invalid mime type");
		if (isValid) {
			error = null;
		}
		cb(error, "./public/documents/posts");
	},
	filename: (req, file, cb) => {
		const name = file.originalname.toLowerCase().split(" ").join("-").split(".")[0];
		const ext = MIME_TYPE_MAP[file.mimetype];
		cb(null, name + "-" + Date.now() + "." + ext);
	},
});

const Post = require("../models/posts");

router.post("/", multer({ storage: storage }).single("image"), async (req, res) => {
	const url = res.hostname;
	imagePath = url + String(req.file.path).replace(/\\/g, "/").slice(6);
	console.log("IMAGEPATH: ", imagePath);
	let post = await new Post({
		title: req.body.title,
		content: req.body.content,
		imagePath,
	}).save();
	res.status(201).json({
		message: "Post succesfully added",
		post: {
			...post,
			id: post._id,
		},
	});
});

router.get("/", async (req, res) => {
	let posts = await Post.find();
	res.status(200).json({
		message: "Posts succesfully fetched",
		posts: posts,
	});
});
router.get("/:id", async (req, res) => {
	let id = req.params.id;
	let post = await Post.findById(id);

	if (!post)
		return res.status(404).json({
			message: "Post not found",
		});
	res.status(200).json({
		message: "Post succesfully fetched",
		post: post,
	});
});

router.patch("/:id", multer({ storage: storage }).single("image"), async (req, res) => {
	let id = req.params.id;
	let imagePath = req.body.imagePath;
	console.log("IMAGEPATH: ", imagePath);
	console.log("IMAGEFILE: ", req.file);
	if (req.file) {
		const url = req.protocol + "://" + req.get("host");
		imagePath = url + String(req.file.path).replace(/\\/g, "/").slice(6);
	}
	let post = {
		title: req.body.title,
		content: req.body.content,
		imagePath: imagePath,
	};
	console.log("POST: ", post);
	let updated = await Post.findByIdAndUpdate(id, post, { useFindAndModify: false });
	res.status(201).json({
		message: "Post succesfully updated",
	});
});

router.delete("/:id", async (req, res) => {
	let id = req.params.id;
	let post = await Post.findByIdAndDelete(id);
	res.status(200).json({
		message: "Post succesfully deleted",
	});
});

module.exports = router;
