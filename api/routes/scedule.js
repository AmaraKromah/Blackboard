const express = require("express"),
	router = express.Router();
const Scedule = require("../models/courses/scedule");
const format = require("date-fns/format"),
	addMinutes = require("date-fns/addMinutes"),
	addHours = require("date-fns/addHours"),
	addDays = require("date-fns/addDays"),
	isEqual = require("date-fns/isEqual"),
	isAfter = require("date-fns/isAfter"),
	isBefore = require("date-fns/isBefore");

router.get("/", async (req, res, next) => {
	try {
		let sceduleList = await Scedule.find().select("-created_at -changed_at").populate("subject", "name -_id");
		let newSceduleList = [];
		sceduleList.forEach(scedule => {
			if (scedule.repeated == false) {
				//uitzoeken waarom gewoon object delete niet werkt
				let newScedule = JSON.parse(JSON.stringify(scedule));
				// delete newScedule.repeated;
				delete newScedule.repeatedDates;
				newSceduleList.push(newScedule);
			} else {
				let repeatedDateList = scedule.repeatedDates;
				repeatedDateList.forEach(repeatScedule => {
					let newRepScedule = JSON.parse(JSON.stringify(scedule));
					// delete newRepScedule.repeated;
					delete newRepScedule.repeatedDates;
					newRepScedule.beginDateTime = repeatScedule.beginDateTime;
					newRepScedule.endDateTime = repeatScedule.endDateTime;

					newSceduleList.push(newRepScedule);
				});
			}
		});

		res.status(200).json(newSceduleList);
	} catch (error) {
		res.status(500).json({ message: "Something went wrong", error: error.message });
	}
});
router.post("/", async (req, res, next) => {
	let body = req.body;
	try {
		console.log(body);
		let scedule = await new Scedule(body).save();
		return res.status(200).json(scedule);
	} catch (error) {
		res.status(500).json({ message: "Something went wrong", error: error.message });
	}
});

// todo, logic in model? (zie User)
router.delete("/:id", async (req, res, next) => {
	/**
	 * #Delete options:
	 *  - 0 :  Delete entire scedule
	 *  - 1 :  Delete only this occurence
	 *  - 2 :  Delete all but this occurence
	 *  - 3 :  Delete all occurence after this occurence
	 *  - 4 :  Delete all occurence before this occurence
	 *  - 5 :  Delete all occurence equal or after this occurence
	 *  - 6 :  Delete all occurence equal or before this occurence
	 */
	const sceduleID = req.params.id,
		toDelSceduleDate = req.body.deleteDates,
		deleteOption = req.body.deleteOption;
	let beginDateToDelete, endDateToDelete;
	if (toDelSceduleDate) {
		beginDateToDelete = new Date(toDelSceduleDate.beginDateTime);
		endDateToDelete = new Date(toDelSceduleDate.endDateTime);
	}
	try {
		let toDelete = await Scedule.findById(sceduleID),
			repeatedDates = toDelete.repeatedDates;
		if (deleteOption > 0) {
			let toDeleterepeatedDates = repeatedDates
				.filter(dates => {
					let dateBegin = new Date(dates.beginDateTime);
					let lefEnd = new Date(dates.endDateTime);
					switch (deleteOption) {
						case 1:
							return isEqual(dateBegin, beginDateToDelete) && isEqual(lefEnd, endDateToDelete);
						case 2:
							return !isEqual(dateBegin, beginDateToDelete) && !isEqual(lefEnd, endDateToDelete);
						/////////////////////////////////////////////////////////////////////
						case 3:
							return isAfter(dateBegin, beginDateToDelete) && isAfter(lefEnd, endDateToDelete);
						case 4:
							return isBefore(dateBegin, beginDateToDelete) && isBefore(lefEnd, endDateToDelete);
						/////////////////////////////////////////////////////////////////////

						case 5:
							return (
								(isAfter(dateBegin, beginDateToDelete) && isAfter(lefEnd, endDateToDelete)) ||
								(isEqual(dateBegin, beginDateToDelete) && isEqual(lefEnd, endDateToDelete))
							);
						case 6:
							return (
								(isBefore(dateBegin, beginDateToDelete) && isBefore(lefEnd, endDateToDelete)) ||
								(isEqual(dateBegin, beginDateToDelete) && isEqual(lefEnd, endDateToDelete))
							);
					}
				})
				.map(toDeleteDate => toDeleteDate._id);
			console.log(deleteOption, "\n", toDeleterepeatedDates, "\n");
			if (toDeleterepeatedDates.length >= 1) {
				//verwijder alle id die overeenkomen met de te verwijderen ID
				await Scedule.findByIdAndUpdate(sceduleID, { $pull: { repeatedDates: { _id: { $in: toDeleterepeatedDates } } } });
				return res.status(200).json("Scedule successfully deleted");
			} else {
				return res.status(200).json("Nothing to delete");
			}
		}
		await Scedule.findByIdAndDelete(sceduleID);

		return res.status(200).json("Scedule successfully deleted");
	} catch (error) {
		res.status(500).json({ message: "Something went wrong", error: error.message });
	}
});

router.post("/random", async (req, res, next) => {
	let origin = res.origin,
		fullpath = res.fullpath;

	let subject = ["5f0273ada475b90d484043b9", "5f02849774ee2c17e8784199", "5f0295174e7a055064ee111f", "5f02954e4e7a055064ee1120"],
		type = ["hoorcollege-", "practicum", "regular"],
		classroom = ["1A", "1B", "1C", "1D", "2A", "2B", "2C", "2D", "3A", "3B", "3C", "3D"];
	let body = req.body;

	let beginDateTime = new Date(body.beginDateTime),
		endDateTime = new Date(body.endDateTime);
	let randSubject = Math.floor(Math.random() * (subject.length - 1)),
		randType = Math.floor(Math.random() * (type.length - 1)),
		randClassroom = Math.floor(Math.random() * (classroom.length - 1)),
		RandomDay = Math.floor(Math.random() * 10),
		beginRandomHour = Math.floor(Math.random() * 3) + 1,
		beginRandomMin = Math.floor(Math.random() * 120) + 30,
		endRandomHour = Math.floor(Math.random() * (beginRandomHour + 3)) + beginRandomHour,
		endRandomMin = Math.floor(Math.random() * (beginRandomMin + 60)) + beginRandomMin;

	try {
		// console.log(beginRandomHour, " : ", beginRandomMin);
		// console.log("added: ", endRandomHour, "hours and ", endRandomMin, "min");
		beginDateTime = addDays(beginDateTime, RandomDay);
		// console.log("begin date: ", beginDateTime, "added days: ", beginRandomDay);
		beginDateTime = addHours(beginDateTime, beginRandomHour);
		beginDateTime = addMinutes(beginDateTime, beginRandomMin);
		endDateTime = addDays(endDateTime, RandomDay);
		endDateTime = addHours(endDateTime, endRandomHour);
		endDateTime = addMinutes(endDateTime, endRandomMin);
		beginTime = format(beginDateTime, "HH:mm:ss");
		endTime = format(endDateTime, "HH:mm:ss");

		// console.log("begin date: ", beginDateTime, "new begin time: ", beginTime);
		// console.log("end date: ", endDateTime, "new begin time: ", endTime);

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
