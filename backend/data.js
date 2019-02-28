// data.js
// database schema

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DataSchema = new Schema(
	{
		id: Number,
		message: String
	},
	{
		timestamps: true 
	}
);

// export
module.exports = mongoose.model("Data", DataSchema);


