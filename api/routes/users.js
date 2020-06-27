var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt"),
	jwt = require("jsonwebtoken");

const Users = require("../models/auth/User");
/* GET users listing. */

/*
Todo Validation:
	 - check password comfirm 
	 - change routes 
	 - move to controller
*/

//todo code optimaliseren

router.get("/", function (req, res, next) {
	Users.find()
		.exec()
		.then(result => {
			let response = {
				message: " User Profiles",
				count: result.length,
				users: result.map(doc => {
					return {
						_id: doc._id,
						firstname: doc.firstname,
						lastname: doc.lastname,
						email: doc.email,
						password: doc.password,
						request: {
							url: "http://localhost:3000/users/" + doc._id,
						},
					};
				}),
			};
			res.status(200).json({
				users: response,
			});
		})
		.catch(err => {
			res.status(500).json({
				message: err,
			});
		});
});

// Delete User
router.delete("/:id", function (req, res, next) {
	let id = req.params.id;
	Users.findByIdAndDelete(id)
		.exec()
		.then(result => {
			if (result) {
				res.status(201).json({
					message: "User deleted",
				});
			} else {
				return res.status(404).json({
					message: "Can't find given User",
				});
			}
		})
		.catch(err => {
			res.status(500).json({
				message: err,
			});
		});
});

module.exports = router;
