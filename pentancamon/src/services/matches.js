import { z } from 'zod'
import { updateorCreateMatchValidation } from '../validation/CreateMatValidation.js'
import { HttpError } from '../utils/httpError.js'
import { Match } from '../models/Match.js'
import { User } from '../models/user.js'
import { isOwner } from '../middlewares/isOwner.js'



//Funcion validar info de req.body (crear partido)
export function validDataMatched (data) {
        const result = updateorCreateMatchValidation.safeParse(data)
        if (!result.success) {
            console.log(result.error.issues)
            throw new HttpError(400, 'Bad data provided')
        } return result.data
    }

//Funcion crear partida
export async function createMatch (user, body) {

        console.log("req body aqui:", body)
        
        const { _id: idCreator } = user  //MIRAR ESTO BIEN

        console.log("idCreator:", idCreator)
        
        
        
        console.log("aqui tengo el:", body)
    
        const data = validDataMatched(body) //validacion con zod (limpiar req.body) //controlar el erro!!!
    
        console.log("que pasa aqui:", data)
    
        const dataWithId = { ...data, creator: idCreator, players: [idCreator] }

        console.log("aqui data withid)", dataWithId )
    
    
        const newMatch = await Match.create(dataWithId);
        if (!newMatch) {
            throw new HttpError(404, "Error creating new Match")
        }
        console.log("aqui newMatch", newMatch)

        //añadir la objectId de match en User.
        const updateUser = await User.findByIdAndUpdate(idCreator, {$addToSet: { matches: newMatch._id}})
        if (!updateUser) {
            throw new HttpError(404, "Error updating matchId in User")
        }

        
        return newMatch 

}

//Funcion buscar partido por Id
export async function matchbyId (dataParams) {
    const { matchId } = dataParams
    const match = await Match.findById(matchId)
        if (!match) {
            throw new HttpError(404, "match not found in DB")
        }
        return match
}

//Funcion unirte a un partido
export async function joinAMatch (dataParams, dataUser) {
        const { matchId } = dataParams
        //necesaria la validacion con zod?
        //const { _id: userId } = req.user
        
        console.log("aqui el req.user", dataUser)
        const {_id: userId } = dataUser
    
        console.log("id del match", matchId)
        console.log("id del usuario", userId)
        
        //comprobar nivel de usuario y de match
        const user = await User.findById (userId)

        const match = matchbyId (dataParams)

        console.log("objeto de usuario:", user)
        console.log("objeto de match:", match)
    
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
        return matchUpdated
}  

//Funcion borrar partido

export async function deleteMatch (dataParams, dataUser) {
        const { matchId } = dataParams;
        const { _id: userId } = dataUser;

        //1) comprobar si es el owner con userId (en User DB)


        //2) en Match findbyIdandDelete (con matchId)

        const deletedMatch = await Match.findByIdAndDelete(matchId) 
            console.log("elemento eliminado")
            if (!deletedMatch) {
                throw new HttpError(500, "Error deleting match")
            }
        return deletedMatch
}




export async function updateMatch (dataParams, dataBody) {
    const { matchId } = dataParams;
    const dataToUpdate = dataBody;

    const dataValidToUpdate = validDataMatched (dataToUpdate)
    
    const matchUpdated = await Match.findByIdAndUpdate({matchId}, dataValidToUpdate, {new: true})
    if (!matchUpdated) { throw new HttpError(404, "match not updated")}
    return matchUpdated
}