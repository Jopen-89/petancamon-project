import mongoose from 'mongoose'


const Schema = mongoose.Schema

const MatchSchema = new Schema({
    creator: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: false
    },  
    level: { 
        type: String, 
        enum: ['top', 'middle', 'low'],
    },
    location: { 
        type: String,
    },
    date: {
        type: Date,
    },
    players: [ 
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    maxPlayers: {
        type: Number,
        required: true,
        min: 2       
    },
    comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
                default: []
            }
        ]
    
})

export const Match = mongoose.model('Match', MatchSchema)