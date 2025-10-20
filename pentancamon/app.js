import 'dotenv/config'
import express from 'express';
import { connectDB } from './src/config/db.config.js';
import { User } from './src/models/user.js';
import { signupValidationSchema } from './src/validation/signupValidation.js';
import { logger } from './src/utils/logger.js';
import { AuthRouter } from './src/routes/authroutes.js';
import { MatchRouter } from './src/routes/matchroutes.js';
import { CommentRouter } from './src/routes/commentroutes.js';
import { errorHandler } from './src/middlewares/errorHandler.js';
import { sessionConfig } from './src/config/session.js';
import passport from 'passport';
import "./src/config/passport.js"
import "./src/config/passport-google.js";



const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {  //ver la request
    logger.debug(req),
    next()
})
connectDB();

//activar session. Añade req.session al objeto req.
app.use(sessionConfig)

app.use(passport.initialize())
app.use(passport.session())



app.get("/", (req, res, next) => 
    res.json({message: "hello Petancamon"})
)

app.use("/", AuthRouter )
app.use("/", MatchRouter)
app.use("/", CommentRouter)

app.use(errorHandler)

app.listen(3000, () => console.log('servidor sonando'))

