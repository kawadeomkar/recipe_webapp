const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");

const API_PORT = 3001;
const app = express();
const router = express.Router();

// this is our MongoDB database, need to create mongodb atlas instance and get connection string 
// make sure to include password
const dbRoute = "";

// connect back end code with db
mongoose.connect(
	dbRoute,
	{ 
	  useNewUrlParser: true,
    }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// check if connection with db is successful 
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// optional logging, bodyparser parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", 
  	"Origin, X-Requested-With, Content-Type, Accept, Authorization"
  	);
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// our get method, fetches all available data in our database
router.get("/getData", (req, res) => {
	Data.find((err, data) => {
		if (err) return res.json({success: false, error: err});
		return res.json({ success: true, data: data });
	});
});

// update method, overrite existing data on db
router.post("/updateData", (req, res) => {
	const { id, update } = req.body;
	Data.findOneAndUpdate(id, update, err => {
		if (err) return res.json({ success: false, error: err });
		return res.json({ success: true });
	});
});

// delete method, removes exisitng data in our database
router.delete("/deleteData", (req, res) => {
	const { id } = req.body;
	Data.findOneAndDelete(id, err => {
		if (err) return res.send(err);
		return res.json({ success: true });
	});
});


// create method, adds new data in database
router.post("/putData", (req, res) => {
	let data = new Data();

	const { id, message } = req.body;
	console.log(id);
	console.log(message);
	console.log(req.body);

	if ((!id && id !== 0) || !message) {
		return res.json({
			success: false,
			error: "INVALID INPUTS"
		});
	}
	data.message = message;
	data.id = id;
	data.save(err => {
		if (err) return res.json({ success: false, error: err});
		return res.json({ success: true });
	});
});

// append /api for http requests
app.use("/api", router);

// launch our backend into a port (to be listened to)
app.listen(API_PORT, () => console.log('LISTENING ON PORT ${API_PORT}'));




