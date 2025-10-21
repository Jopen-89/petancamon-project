import { HttpError } from "../utils/httpError.js"
import bcrypt from 'bcrypt'

export async function createHashedPassword (password, saltRounds) {
    try {
    const salt = await bcrypt.genSalt(saltRounds)
    const hashedPass = await bcrypt.hash(password, salt)
    return hashedPass 
} catch (err) {
    throw new HttpError(500, "Error hashing password") 
}
}


export async function comparePassword (password, hashedPassword) {
    try {
        const result = await bcrypt.compare(password, hashedPassword)
        return result
    } catch (err) {
        throw new HttpError(500, "Error comparing passwords")
    }
}