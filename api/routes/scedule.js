const express = require("express"),
	router = express.Router();
const Scedule = require("../models/courses/scedule");
router.get("/", async (req, res, next) => {
	try {
		let scedule = await Scedule.find().select("-created_at -changed_at").populate("subject", "name -_id");

		res.status(200).json({ message: "We are good to go", scedule });
	} catch (error) {
		res.status(500).json({ message: "Something went wrong", error });
	}
});

var format = require("date-fns/format");
var addMinutes = require("date-fns/addMinutes");
var addHours = require("date-fns/addHours");
router.post("/", async (req, res, next) => {
	let origin = res.origin,
		fullpath = res.fullpath;

	let subject = ["5f0273ada475b90d484043b9", "5f02849774ee2c17e8784199", "5f0295174e7a055064ee111f", "5f02954e4e7a055064ee1120"],
		type = ["hoorcollege", "practicum", "regular"],
		classroom = ["1A", "1B", "1C", "1D", "2A", "2B", "2C", "2D", "3A", "3B", "3C", "3D"];
	let body = req.body;

	let beginDateTime = new Date(body.beginDateTime),
		endDateTime = new Date(body.endDateTime);
	let randSubject = Math.floor(Math.random() * (subject.length - 1)),
		randType = Math.floor(Math.random() * (type.length - 1)),
		randClassroom = Math.floor(Math.random() * (classroom.length - 1)),
		beginRandomHour = Math.floor(Math.random() * 3) + 1,
		beginRandomMin = Math.floor(Math.random() * 120) + 30,
		endRandomHour = Math.floor(Math.random() * (beginRandomHour + 3)) + beginRandomHour,
		endRandomMin = Math.floor(Math.random() * (beginRandomMin + 60)) + beginRandomMin;

	try {
		// console.log(beginRandomHour, " : ", beginRandomMin);
		// console.log("added: ", endRandomHour, "hours and ", endRandomMin, "min");
		beginDateTime = addHours(beginDateTime, beginRandomHour);
		beginDateTime = addMinutes(beginDateTime, beginRandomMin);
		endDateTime = addHours(endDateTime, endRandomHour);
		endDateTime = addMinutes(endDateTime, endRandomMin);
		beginTime = format(beginDateTime, "HH:mm:ss");
		endTime = format(endDateTime, "HH:mm:ss");

		console.log("begin date: ", beginDateTime, "new begin time: ", beginTime);
		console.log("end date: ", endDateTime, "new begin time: ", endTime);

		body.subject = subject[randSubject];
		body.type = type[randType];
		body.classroom = classroom[randClassroom];
		body.beginDateTime = beginDateTime;
		body.endDateTime = endDateTime;
		let scedule = await new Scedule(body).save();

		return res.status(200).json({ message: "We are good to go", scedule });
	} catch (error) {
		res.status(500).json({ message: "Something went wrong", error: error.message });
	}
});
module.exports = router;
