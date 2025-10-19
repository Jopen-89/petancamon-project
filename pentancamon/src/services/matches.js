import { z } from 'zod'
import { matchCreateValidation } from '../validation/CreateMatValidation.js'
import { HttpError } from '../utils/httpError.js'
import { Match } from '../models/Match.js'

export function validDataMatched (data) {
        const result = matchCreateValidation.safeParse(data)
        if (!result.success) {
            console.log(result.error.issues)
            throw new HttpError(400, 'Bad data provided')
        } return result.data
    }


export async function createMatch (user, body) {

        console.log("req body aqui:", body)
        
        const { _id: idCreator } = user  //MIRAR ESTO BIEN

        console.log("idCreator:", idCreator)
        
        
        
        console.log("aqui tengo el:", body)
    
        const data = validDataMatched(body) //validacion con zod (limpiar req.body) //controlar el erro!!!
    
        console.log("que pasa aqui:", data)
    
        const datawithid = { ...data, creator: idCreator, players: [idCreator] }

        console.log("aqui data withid)", datawithid)
    
    
        const newMatch = await Match.create(datawithid);

        console.log(newMatch)
        
        return newMatch 

}