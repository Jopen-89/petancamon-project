import 'dotenv/config'
import bcrypt from 'bcrypt'
import { createHashedPassword } from '../middlewares/createAHashedPassword.js';
import { User } from '../models/user.js';
import { HttpError } from '../utils/httpError.js';
import mongoose from 'mongoose';


( async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const saltRounds = 10;

        const password = "Pepeblanco0"

        const hashedPass = await createHashedPassword(password, saltRounds)

        console.log(hashedPass)

        const mE = {
            username: "Jose Maria Romero",
            nickname: "Jopen",
            email: "solimonra@gmail.com",
            hashedPass,
            level: "top",
        }

        const createdUser = await User.create(mE)

            if (!createdUser) {
                throw new HttpError(404, 'Error creating user')     
            }       

        console.log("User created", createdUser )

        } catch (err) {
            console.error("Error creating user", err)

        } finally {
            await mongoose.connection.close()
            console.log("mongoDB connection closed")

        }

}) ();
    
