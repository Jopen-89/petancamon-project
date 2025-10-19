import express, { Router } from 'express';
import { logger } from '../utils/logger.js';
import { signupValidationSchema } from '../validation/signupValidation.js';
import { createNewUser, emailIsUnique, registerValidation } from '../services/authenticacion.js';
import { User } from '../models/user.js';
import { createHashedPassword } from '../services/authenticacion.js';
import { isLoggedIn, isloggedOut } from '../middlewares/loggedinout.js';
import passport from '../config/passport.js'

import { HttpError } from '../utils/httpError.js';



const router = express.Router();

//RUTA POST SIGNUP CON VALIDACION ZOD, HASHEO DE PASS Y MANEJO DE ERRORES

router.post("/signup", isloggedOut, async (req, res, next) => {   
    try {
        
        const data = registerValidation(req.body); 
          // meter la parte de hashear dentro de createNewUSer
        console.log(data)
        const { username, email, password, level } = data;  //hay que usar result.data lo devuelve registerValidation
        console.log(level)
        
        const emailN = email.trim().toLowerCase(); //normalizo el email
        await emailIsUnique(emailN);
        

        const hashedPass = await createHashedPassword(password);
        
        const registeredUser = {
            username,
            email: emailN,
            hashedPass,
            level
        }
        console.log("Usuario a crear:", registeredUser);

        const newUser = await createNewUser(registeredUser)
        console.log(newUser)
        res.status(201).json(newUser)
        
             
    } catch (err) {
        return next(err); 
        };
    });

//RUTA LOGIN Passport LOCALSTRATEGY


router.post("/login", isloggedOut,     //incluye mensaje en req.session.message (failureMessage) cuando falla
    passport.authenticate ('local', {failureMessage: true}), (req, res) => {
        console.log(req.user)
        console.log(req.session.passport.user)

        const {_id, email, username } = req.user;
        //creo user con req.user
        const user = {
            id: String(_id),
            email,
            username           
        };

        res.status(200).json({message: "User logged succesfully", user})
        })   //usuario logeado


//RUTA LOGIN Passport GoogleStrategy 2 rutas necesarias

router.get('/auth/google',isloggedOut, passport.authenticate('google', { scope: ['openid', 'email', 'profile'] })); //a pagina de permisos de google

// crea accesstoken, refreshtoken y profile y lo lleva a la callback de la estrategia
router.get('/auth/google/callback', passport.authenticate('google', {failureMessage: true}), (req, res, next) => {
    try {
    if (!req.user) throw new HttpError(401, "Authenticacion failed")
        console.log('esta es la id del owner:', req.user._id)
        const { username, email } = req.user
    res.status(200).json({
        message: "User logged successfully",
        username,
        email 
    });
} catch (err) {
    next (err)
}
}
);

router.get("/logout", isLoggedIn, async (req, res, next) => {
    req.logout( err => {   //cerrar la sesion  //elimina req.user
        if (err) {
            return next(new HttpError(500, "Error performing logout"));
        }
        req.session.destroy((destroyErr) => {             //callback con el error
            if (destroyErr) {
                return (next(new HttpError(500, "Error destroying session")))
            }  //borra sesion en servidor  req.session
            res.clearCookie("connect.sid")  //borra cookie del cliente
            res.status(200).json({message: "session destroyed"})
        })
    })
    
})

    






export { router as AuthRouter };

