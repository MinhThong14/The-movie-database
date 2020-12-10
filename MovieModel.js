
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let movieSchema = Schema({
	//Names will be strings between 1-30 characters
	//Must consist of only A-Z characters
	//Will be trimmed automatically (i.e., outer spacing removed)
	title: {
		type: String, 
		required: true
	},
    year: {
        type: String
    },
    runtime: {
        type: String, 
		required: true
    },
    genre: [String],
    director:[String],
    writer:[String],
    actor:[String],
    plot: {
        type: String
    },
    reviews:[{
        userId: {type: Schema.Types.ObjectId, ref:'User'},
        username:{
            type: String
        },
        rating:{
            type: Number,
            min: 0,
            max: 10,
        },
        comment:{
            type: String
        }
    }]
});

module.exports = mongoose.model("Movie", movieSchema);
