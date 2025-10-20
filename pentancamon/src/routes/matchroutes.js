import express from 'express'
import { Router } from 'express'
import { HttpError } from '../utils/httpError.js'
import { Match } from '../models/Match.js'
import { createMatch, deleteMatch, validDataMatched } from '../services/matches.js'
import { isLoggedIn } from '../middlewares/loggedinout.js'
import { User } from '../models/user.js'
import mongoose from 'mongoose'
import { matchbyId } from '../services/matches.js'
import { joinAMatch } from '../services/matches.js'
import { isOwner } from '../middlewares/isOwner.js'
import { updateMatch } from '../services/matches.js'

const router = express.Router()


router.post("/createMatch", isLoggedIn, async (req, res, next) => {
    try {
    const newMatch = await createMatch (req.user, req.body)
  
    console.log(newMatch)
    res.status(201).json({message: "Created succesfully", match: newMatch})

    } catch (err) {
            next(err);
        }
    }
)
        
    //errores importantes: err.name, err.code
    // if (err.code === 11000) { return next(new HttpError(409, "Duplicate key error")
    // if (err.name === "ValidationError") {return next(new HttpError(400, "Validation error creating match"))}


//RUTA LISTA DE PARTIDOS

router.get("/matches", async (req, res, next) => {
    try {
        const matches = await Match.find()
    
        if (!matches) {
            throw new HttpError(404, "matches not found")
        }
        res.status(200).json(matches);
    } catch (err) {
        next(err)
        }
    }
    )

//RUTA DETALLES DEL PARTIDO

router.get("/matches/:matchId", isLoggedIn, async (req, res, next) => {
    try {
        
        const match = await matchbyId (req.params)
        res.status(200).json(match);

    } catch(err) {
            next(err)
        }
    })




//RUTA JOIN A MATCH

router.post("/matches/:matchId/join", isLoggedIn, async (req, res, next) => {
    try {

    const matchUpdated = await joinAMatch(req.params, req.user)    

    console.log("player añadido", matchUpdated)

    res.status(200).json({
        message: "player joined",
        playersCount: matchUpdated.players.length
    })

    } catch (err) {
        next(err)
    }
}
)

//RUTA DELETE MATCH

router.get("/matches/:matchId/delete", isLoggedIn, isOwner, async (req, res, next) => {
    try {
    
        const deletedMatch = await deleteMatch(req.params, req.user)
        res.status(200).json({message: "match deleted"}, {match: deletedMatch})
       
    } catch (err) {
        next(err)
    }
    } 
)

// RUTA UPDATE A MATCH

router.post("/matches/:matchId/update", isLoggedIn, isOwner, async (req, res, next) => {
    try {

        const matchUpdated = updateMatch (req.params, req.body)
        res.status(200).json({message: "Match succesfully updated"}, {match: matchUpdated})

    } catch (err) {
        next(err)
    }
}
)



    

export { router as MatchRouter };