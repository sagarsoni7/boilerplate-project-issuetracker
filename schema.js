//All the requirements
let mongoose = require('mongoose');
let Schema = mongoose.Schema;


//Create schema
let userSchema = new Schema ({
  issue_title: String,
  issue_text: String,
  created_by: String,
  assigned_to: String,
  status_text: String,
  created_on: Date,
  updated_on: Date,
  open: Boolean
})


//Create model
let user = mongoose.model("user", userSchema)

//Export model
exports.user = user;