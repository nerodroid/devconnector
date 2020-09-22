const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create schema
const QuerySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  text: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Query = mongoose.model("query", QuerySchema);
