const express = require("express"),
	router = express.Router();
const Scedule = require("../models/courses/scedule");
router.get("/", async (req, res, next) => {
	let origin = res.origin,
		fullpath = res.fullpath;
	res.status(200).json("We are good to go");
});

router.post("/", async (req, res, next) => {
	let origin = res.origin,
		fullpath = res.fullpath;
	res.status(200).json("We are good to go");
});
module.exports = router;
