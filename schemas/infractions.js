const { model, Schema } = require("mongoose");

module.exports = model(
  "infractions",
  new Schema({
    guild: String,
    user: String,
    username: String,
    infractions: Array,
  })
);
