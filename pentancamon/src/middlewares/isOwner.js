import { User } from "../models/user.js"
import { Match } from "../models/Match.js"
import { HttpError } from "../utils/httpError.js"

export async function isOwner (matchId, userId) {
    const resultUser = await User.findById(userId)
        
        if (!resultUser) {
            throw new HttpError(404, "Error finding user in DB")
        }   

        const matchOwner = await Match.findById(matchId) 
        
            if (!matchOwner) {
            throw new HttpError(404, "Error finding match in DB") 
        }
        
        console.log("userid", userId)
        console.log("match owner id", matchOwner.creator)


        if (userId.toString() !== matchOwner.creator.toString()) {
            throw new HttpError(403, "User logged is not the owner")
        }
}