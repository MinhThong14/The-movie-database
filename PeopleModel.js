
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let peopleSchema = Schema({
	//Names will be strings between 1-30 characters
	//Must consist of only A-Z characters
	//Will be trimmed automatically (i.e., outer spacing removed)
	name: {
        type: String, 
		required: true
    },
    bio: {
        type: String,
    },
    movies:[String],
    topCollaboration:[String],
    followedBy:[{
        _id: {type: Schema.Types.ObjectId, ref:'User'},
        username: {type: String}
    }],
});

module.exports = mongoose.model("People", peopleSchema);
