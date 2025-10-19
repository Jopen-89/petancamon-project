import passport from "passport"
import {Strategy as LocalStrategy} from "passport-local" //dentro del paquete passport-local hay una propiedad Strategy la renombro a localstrategy
import { User } from "../models/user.js";
import bcrypt from "bcrypt"
import { HttpError } from "../utils/httpError.js";


passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: false

    }, async (email, password, done) =>{
        try {
            console.log('email recibido', email)
            console.log('Password recibido', password)

            const emailN = email.trim().toLowerCase()       
            
            const user = await User.findOne({email: emailN});

            if (!user) {
              console.log("usuario no encontrado")
              return done(null, false, {message: "User not found"}
            )};

            const isMatch = await bcrypt.compare(password, user.hashedPass)

            if (!isMatch)
              return done(null, false, {message: "wrong password"})

            return done(null, user);

            } catch (err) {  
            return done(new HttpError(500, "Error searching in database"))
      }
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, String(user.id));
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    if (!user) return done(null, false);
    return done(null, user);   
  } catch (err) {
    return done(err)
  }
});



export default passport