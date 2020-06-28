const jwt = require("jsonwebtoken");
const User = require("../../models/auth/User");

/* 

Todo:
- Uitbreiden voor rollen/ rechten (permissies)

*/
// check whether the request has a valid JWT access token
module.exports.authenticate = (req, res, next) => {
	let token = req.headers["x-access-token"];
	try {
		let token = req.headers["x-access-token"];
		const decoded = jwt.verify(token, User.getJWTSecret());
		res.user_id = decoded._id;
		// console.log("DOCODED: ", decoded);
		next();
	} catch (error) {
		return res.status(401).json({ message: "Not Authorised!", error: error.message });
	}
};

// Verify Refresh Token Middleware (which will be verifying the session)
module.exports.verifySession = async (req, res, next) => {
	let refreshToken = req.header("x-refresh-token");
	let _id = req.header("_id");

	try {
		let user = await User.findByIdAndToken(_id, refreshToken);
		if (!user) {
			return res.status(404).json({
				message: "User not found. Make sure that the refresh token and user id are correct",
			});
		}
		req.user_id = user._id;
		req.userObject = user;
		req.refreshToken = refreshToken;

		let isSessionValid = false;
		user.sessions.forEach(session => {
			if (session.token === refreshToken) {
				// check if the session has expired
				if (!User.hasRefreshTokenExpired(session.expiresAt)) isSessionValid = true;
			}
		});

		if (!isSessionValid) {
			// the session is not valid
			return res.status(401).json({
				message: "Refresh token has expired or the session is invalid",
			});
		}
		next();
	} catch (error) {
		res.status(401).send(error.message);
	}
};

// module.exports.isAuth = (req, res, next) => {
// try {
// 	const token = req.headers["authorization"].split(" ")[1];
// 	const decoded = jwt.verify(token, process.env.JWT_LOGGIN_KEY);
// 	res.userData = decoded;
// 	next();
// } catch (error) {
// 	return res.status(401).json({ message: "Not Authorised" });
// }
// };
