import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { User } from '../models/user.js'
import { HttpError } from '../utils/httpError.js'

passport.use (new GoogleStrategy(
    {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: false
    }, 
    async (accessToken, refreshToken, profile, cb) =>  {
        try {
            console.log("Perfil de Google recibido", profile)
            if (!profile) throw new HttpError(401, "Invalid Google profile")
            const email = profile.emails?.[0]?.value.toLowerCase() || null
            const avatar = profile.photos?.[0]?.value || null
            const gId = profile.id;
            
            //1) existe usuario?

            const user = await User.findOne({googleId: profile.id})

            

            // 2) comprobar si previamente se han registrado con LocalStrategy y añadimos gId

            if (!user && email) {
                const byEmail = await User.findOne({email});
                if (byEmail) {
                    byEmail.googleId = gId;
                    if (!byEmail.avatar && avatar) 
                        byEmail.avatar = avatar;
                    await byEmail.save()   //guardo los cambios realizados en el documento de DB
                    user = byEmail;
                }
                }
            //si user sigue sin existir creamos uno nuevo
            if (!user) {
                console.log(profile.displayName)
                console.log(email)
                console.log(gId)
                console.log(avatar)
                const user = await User.create({              //si no existe email, coge lo anterior a la @ del email como nombre, si no inventa nombre con user_ y gId
                    username: profile.displayName, // (email ? email.split('@')[0] : `user_${gId}`
                    email,
                    googleId: gId,
                    
                    
                });
                
            } 
            return cb(null, user);
              //null = no hay error y devuelve user creado
        } catch (err) {
            //si falla la DB
            return cb (new HttpError(500, "Database error during Google Login"));
        }
    }
    )
);
        
            
            
          