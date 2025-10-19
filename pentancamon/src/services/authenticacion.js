import { signupValidationSchema } from "../validation/signupValidation.js";
import { HttpError } from "../utils/httpError.js";
import { logger } from "../utils/logger.js";
import bcrypt from 'bcrypt'
import { User } from "../models/user.js";
import { email } from "zod";
const saltRounds = 10
 

export function registerValidation (user) {   //user va a ser req.body
    
    const result = signupValidationSchema.safeParse(user);
    if (!result.success) {
        console.log(result.error.issues)
        throw new HttpError(400, "Not signup provided") 
    } return result.data
} 


export async function createHashedPassword (password) {
   
    const Salt = await bcrypt.genSaltSync(saltRounds);
    const hashedPass = await bcrypt.hashSync(password, Salt)
    return hashedPass
}

export async function createNewUser (registeredUser) {
    try { 
        
    const createdUser = await User.create(registeredUser)
    
    const { username, email } = createdUser;
    logger.info('User created', { username, email});
    return createdUser
} catch (error) {
    console.log(error)
    throw new HttpError(500, "Error creating user in database")
}

} 
 
export async function emailIsUnique (emailN) {
    
    try {  
    const exist = await User.findOne({email: emailN})
    
    if (exist) {
        throw new HttpError(409, "Email already registered")
    }
        } catch (err) {   //si el error ya es un httphandler lo vuelvo a lanzar tal cual.
            if (err instanceof HttpHandler) throw err;
            throw new HttpError(500, "Database query failed")
        }
    }





