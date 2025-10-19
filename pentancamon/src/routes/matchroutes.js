import express from 'express'
import { Router } from 'express'
import { matchCreateValidation } from '../validation/CreateMatValidation.js'
import { HttpError } from '../utils/httpError.js'
import { Match } from '../models/Match.js'
import { createMatch, validDataMatched } from '../services/matches.js'
import { isLoggedIn } from '../middlewares/loggedinout.js'
import { User } from '../models/user.js'
import mongoose from 'mongoose'


const router = express.Router()


router.post("/createMatch", async (req, res, next) => {
  try {
    const newMatch = await createMatch (req.user, req.body)
  
    console.log(newMatch)
    res.status(201).json({message: "Created succesfully", match: newMatch})

    } catch (err) {
        if (err instanceof HttpError) {
    
            next(err);
        }}})
        
    //errores importantes: err.name, err.code
    // if (err.code === 11000) { return next(new HttpError(409, "Duplicate key error")
    // if (err.name === "ValidationError") {return next(new HttpError(400, "Validation error creating match"))}



//RUTA LISTA DE PARTIDOS

router.get("/matches", async (req, res, next) => {
    const matches = await Match.find()
        try {
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
    const { matchId } = req.params

    const match = await Match.findById(matchId)
        try {
            if (!match) {
                throw new HttpError(404, "match not found in DB")
            }
        res.status(200).json(match)
        } catch(err) {
            next(err instanceof HttpError ? err : new HttpError(500, "Internal server error while fetching match"))
        }
    }
)




//RUTA JOIN A MATCH

router.post("/matches/:matchId/join", isLoggedIn, async (req, res, next) => {
    try {
    const { matchId } = req.params
    //necesaria la validacion con zod?
    //const { _id: userId } = req.user
    console.log("aqui el req.session.passport.user", req.session.passport.user)
    console.log("aqui el req.user", req.user)
    const {_id: userId } = req.user

    console.log("id del match", matchId)
    console.log("id del usuario", userId)
    
    //comprobar nivel de usuario y de match
    const user = await User.findById (userId)
    const match = await Match.findById(matchId)

    console.log("objeto de usuario:", user)
    console.log("objeto de match:", match)

    //comprobar si existe match
    if (!match) throw new HttpError(404, "Match not found")

    //comprobar si el match esta completo
    const currentPlayers = match.players.length
    if (currentPlayers === match.maxPlayers) {
        throw new HttpError(409, "Match is full")
    }
    //comprobar el nivel
    if (user.level != match.level) {
        throw new HttpError(403, "level not allowed to join")
    }

    //añado player al array de players
    const matchUpdated = await Match.findOneAndUpdate( //con este devuelve documento .select (elijo los documentos que quiero traer)
        { _id: matchId, players: {$ne: userId} }, //busca partido que no tenga a este player. //error indicando si no se cumple
        {$addToSet: {players: userId}},
        { new: true } //devuelva el actualizado
    ).select("players")
    if (!matchUpdated) {
        throw new HttpError(500, "Error adding de player")
    }

    console.log("player añadido", matchUpdated)

    res.status(200).json({
        message: "player joined",
        playersCount: matchUpdated.players.length
    })


} catch (err) {
    next(err instanceof HttpError ? err : new HttpError (500, "Error joining the match"))
}
}
)

//RUTA DELETE MATCH

router.get("/match/:matchId/delete", async (req, res, next) => {
    const { matchId } = req.params;
    const { _id: userId } = req.user

    //1) comprobar si es el owner con userId (en User DB)

    const resultUser = await User.findById(userId)
    try {
    if (!resultUser) {
        throw new HttpError(404, "Error finding user in DB")
    }
    } catch (err) {
        next(err)
    }

    const matchOwner = await Match.findById(matchId) 
    try {
        if (!matchOwner) {
        throw new HttpError(404, "Error finding match in DB") 
    }
    } catch (err) {
        next(err)
    }
    console.log("userid", userId)
    console.log("match owner id", matchOwner.creator)


    if (userId.String() !== matchOwner.creator.String()) {
        throw new HttpError(403, "User logged is not the owner")
    }

    //2) en Match findbyIdandDelete (con matchId)

    const Deleted = await Match.findByIdAndDelete(matchId) 
    try {
    console.log("elemento eliminado")
    if (!Deleted) {
        throw new HttpError(500, "Error deleting match")
    }
    } catch (err) {
        next(err)
    }

} )

// RUTA UPDATE A MATCH



    
    








export { router as MatchRouter };