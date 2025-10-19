import session from 'express-session'
import { HttpError } from '../utils/httpError.js'
import MongoStore from 'connect-mongo'



export const sessionConfig = session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false,
        maxAge: 24 * 60 * 60 * 1000
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl : 24 * 60 * 60 //1 dia
    })
})


