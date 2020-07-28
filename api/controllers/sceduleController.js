const Scedule = require("../models/courses/scedule"),
	Subject = require("../models/courses/subject");
const isEqual = require("date-fns/isEqual"),
	isAfter = require("date-fns/isAfter"),
	isBefore = require("date-fns/isBefore");
const _ = require("lodash");

/**
 * Method: GET
 * Purpose: retrieve all scedle
 */
exports.scedule_list = async (req, res, next) => {
	try {
		let sceduleList = await Scedule.find().select("-created_at -changed_at").populate("subject", "name _id");
		let newSceduleList = [];
		sceduleList.forEach(scedule => {
			//-for single events
			if (scedule.repeated == false) {
				let newScedule = scedule.toJSON();
				delete newScedule.repeatedDates;
				newSceduleList.push(newScedule);
			} else {
				let repeatedDateList = scedule.repeatedDates;
				//-for event in sequence
				repeatedDateList.forEach(async repeatScedule => {
					//-for event in sequence that has been updated individually
					if (repeatScedule.updatesingle) {
						let updatedScedule = repeatScedule.toJSON();
						updatedScedule.repeatID = updatedScedule._id;
						updatedScedule._id = String(scedule._id);
						updatedScedule.repeated = scedule.repeated;
						updatedScedule.occurenceText = scedule.occurenceText;
						delete updatedScedule.updatedScedule;
						newSceduleList.push(updatedScedule);

						//-for event that has been updated in bluk/ have to the same data as parent
					} else {
						let newRepScedule = scedule.toJSON();
						delete newRepScedule.repeatedDates;
						newRepScedule.beginDateTime = repeatScedule.beginDateTime;
						newRepScedule.endDateTime = repeatScedule.endDateTime;
						newRepScedule.repeatID = repeatScedule._id;
						newSceduleList.push(newRepScedule);
					}
				});
			}
		});
		res.status(200).json(newSceduleList);
	} catch (error) {
		res.status(500).json({ message: "Something went wrong", error: error.message });
	}
};

/**
 * Method: POST
 * Purpose: Add a scedule/ list of scedule
 */
exports.scedule_create = async (req, res, next) => {
	let body = req.body;
	try {
		let scedule = await new Scedule(body).save();
		return res.status(200).json(scedule);
	} catch (error) {
		res.status(500).json({ message: "Something went wrong add", error: error.message });
	}
};

/**
 * Method: PATCH/:id
 * Purpose: Update a single or a list of scedule
 */
exports.scedule_update = async (req, res, next) => {
	let body = req.body;
	let _id = req.params.id,
		repeatID = body.repeatID;
	try {
		let updateAll = body.updateAll;
		let subjectref = await Subject.findById(body.subject, "name _id"),
			esentialUpdate = _.pick(body, ["subject", "classroom", "type"]);
		let beginTime = new Date(body.beginDateTime).toTimeString(),
			endTime = new Date(body.endDateTime).toTimeString();
		let scedule = await Scedule.findById(_id);

		let repeatDates = scedule.repeatedDates;
		repeatDates.forEach((dates, index) => {
			let beginDate = new Date(dates.beginDateTime).toDateString(),
				endDate = new Date(dates.endDateTime).toDateString();
			let newBeginDateTime = new Date(`${beginDate} ${beginTime}`),
				endDateTime = new Date(`${endDate} ${endTime}`);

			if (updateAll) {
				scedule.repeatedDates[index].beginDateTime = newBeginDateTime;
				scedule.repeatedDates[index].endDateTime = endDateTime;
				scedule.repeatedDates[index].type = scedule.repeatedDates[index].subject = scedule.repeatedDates[index].classroom = scedule.repeatedDates[
					index
				].updatesingle = undefined;
			}
			//#update single
			if (String(repeatID) === String(dates._id) && !updateAll) {
				let soloUpdate = (scedule.repeatedDates[index] = esentialUpdate);
				soloUpdate.beginDateTime = new Date(body.beginDateTime);
				soloUpdate.endDateTime = new Date(dates.endDateTime);
				soloUpdate.endDateTime = new Date(dates.endDateTime);
				soloUpdate.updatesingle = true;
				soloUpdate.subject = subjectref;
			}
		});
		scedule.save();
		if (updateAll) {
			let updateAllScedule = await Scedule.findByIdAndUpdate(
				_id,
				esentialUpdate,
				(options = {
					useFindAndModify: false,
					new: true,
				})
			);
			return res.status(200).json(updateAllScedule);
		}
		return res.status(200).json(scedule);
	} catch (error) {
		res.status(500).json({ message: "Something went wrong edit", error: error.message });
	}
};

/**
 * Method: Delete/:id
 * Purpose: Delete a single or a list of scedule
 */
exports.scedule_delete = async (req, res, next) => {
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
		res.status(500).json({ message: "Something went wrong delete", error: error.message });
	}
};
