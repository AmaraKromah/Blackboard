const jwt = require("jsonwebtoken");

/* 

Todo:
- Uitbreiden voor rollen/ rechten (permissies)

*/
module.exports.isAuth = (req, res, next) => {
	try {
		const token = req.headers["authorization"].split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_LOGGIN_KEY);
		res.userData = decoded;
		next();
	} catch (error) {
		return res.status(401).json({ message: "Not Authorised" });
	}
};
