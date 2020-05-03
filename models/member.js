const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const memberSchema = new Schema({
  email: String,
  password: String,
  firstname: String,
  lastname: String,
  organization: String,
  //qrcode: { data: Buffer, contentType: String },
});

module.exports = mongoose.model('member', memberSchema);
