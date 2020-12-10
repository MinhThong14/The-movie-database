const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let NotificationSchema = Schema({
	userId: String,
	username: String,
	content: String,
	isRead: { type: Boolean, default: false }
});

module.exports = mongoose.model("Notification", NotificationSchema);
