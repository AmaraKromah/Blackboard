require("dotenv/config");
const express = require("express"),
	path = require("path"),
	cookieParser = require("cookie-parser"),
	helmet = require("helmet");
(logger = require("morgan")), (cors = require("cors")), (mongoose = require("mongoose"));

const indexRouter = require("./api/routes/index"),
	authRouter = require("./api/routes/auth/auth"),
	usersRouter = require("./api/routes/users"),
	educationRouter = require("./api/routes/education"),
	SubjectsRouter = require("./api/routes/subjects"),
	AssigmentsRouter = require("./api/routes/assigment"),
	//angular
	postRouter = require("./api/routes/post");

// ENVIRONMENT VARIABLE
let mongo_url = process.env.MONGO_URL,
	mongo_pass = process.env.MONGO_PASSWORD,
	mongo_cluster = process.env.MONGO_CLUSTER_URL,
	mongo_db = process.env.MONGO_DB;

// END ENVIRONMENT VARIABLE

let corsOptions = {
	optionsSuccessStatus: 200,
	allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id",
	exposedHeaders: "x-access-token, x-refresh-token",
};

const mongodb = `${mongo_url}${mongo_pass}${mongo_cluster}${mongo_db}`;

var app = express();

mongoose.set("useCreateIndex", true);
mongoose.connect(mongodb, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("connected", () => console.log("MongoDB connection succesful:"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors(corsOptions));
app.use(helmet());

//- Making fullpath globally available
app.use((req, res, next) => {
	let port = req.app.settings.port,
		origin = req.originalUrl,
		fullpath = `${req.protocol}://${req.hostname}:${port}${origin}`;

	res.hostname = `${req.protocol}://${req.hostname}:${port}`;
	res.fullpath = fullpath;
	res.origin = origin;
	next();
});

//- Route grouping
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/educations", educationRouter);
app.use("/subjects", SubjectsRouter);
app.use("/assignments", AssigmentsRouter);

//# ANGULAR TESTING

app.use("/api/posts", postRouter);
//# END ANGULAR TESTING

//-      Error Handling          //

// for when routes are not found
app.use((req, res, next) => {
	let fullpath = res.fullpath;
	const error = new Error(`url: ${fullpath} not found `);
	error.status = 404;
	next(error);
});

// for all other error that might occur
app.use((error, req, res, next) => {
	res.status(error.status || 500); // stuur ofwel onze eigen error status, of stuur een 500 (server error) terug
	res.json({
		error: {
			//maak een error object met daarin de boodschap
			message: error.message,
		},
	});
});

module.exports = app;
