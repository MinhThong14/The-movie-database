const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let userSchema = Schema({
	//Names will be strings between 1-30 characters
	//Must consist of only A-Z characters
	//Will be trimmed automatically (i.e., outer spacing removed)
	username: {
		type: String,
		required: true
	},
	password: {
        type: String, 
		required: true
    },
    contributingUser: {
        type: Boolean
    },
    peopleFollow:[{
        _id: {type: Schema.Types.ObjectId, ref:'People'},
        name: {type: String}
    }],
    userFollow:[{
        _id: {type: Schema.Types.ObjectId, ref:'User'},
        username: {type: String}
    }],
    followedBy:[{
        _id: {type: Schema.Types.ObjectId, ref:'User'},
        username: {type: String}
    }],
    notifications: [
    	{
            userId: {type : String},
            username: {type: String},
            content: {type: String},
            isRead: { type: Boolean, default: false}
    	}
    ],
    reviews:[{
        movieId: {type: Schema.Types.ObjectId, ref:'Movie'},
        title: {
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
    }],
    viewedMovies: [String]

});

module.exports = mongoose.model("User", userSchema);
