import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    creator: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    comment: {
        type: String,       
    },
    match: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Match",
        required: true
    }
})

export const Comment = mongoose.model("Comment", commentSchema)