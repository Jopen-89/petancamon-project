import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { 
        type: String,
        required: true,
    },
    nickname: { 
        type: String,
    },
    email: {
      type: String,
      required: function () { return !this.googleId; },
      unique: true,
      lowercase: true,
      trim: true,
    },
    hashedPass: { 
        type: String,
        required: function () { return !this.googleId; },
    },
    googleId: { type: String, index: true, sparse: true },
    imgUrl: {
        type: String,
        default: "uploads/default.png",
    },
    level: {
        type: String, 
        enum: ['top', 'middle', 'low'],
        default: "low",
        
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comments"
        }
    ],
    matches: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Match" 
        }
    ],    
})

export const User = mongoose.model('User', userSchema)