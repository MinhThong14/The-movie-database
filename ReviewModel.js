
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let reviewSchema = Schema({
	//Names will be strings between 1-30 characters
	//Must consist of only A-Z characters
	//Will be trimmed automatically (i.e., outer spacing removed)
	user: {type: Schema.Types.ObjectId, ref:'User'},
	movie: {type: Schema.Types.ObjectId, ref:'User'},
    
    rating:{
        type: Number,
        min: 0,
        max: 10,
    },
    comment:{
        type: String
    }

});

module.exports = mongoose.model("Review", reviewSchema);