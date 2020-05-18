const bcrypt = require("bcrypt"),
	jwt = require("jsonwebtoken"),
	async = require("async");

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
	}
};

module.exports = methods;
