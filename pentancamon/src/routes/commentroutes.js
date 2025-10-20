import express from 'express'
import { User } from '../models/user.js';
import { Match } from '../models/Match.js';
import { Comment } from '../models/comment.js';
import { HttpError } from '../utils/httpError.js';
import { promise } from 'zod';

const router = express.Router()

//ruta crear un comentario
router.post("/matches/:matchId/newComment", async (req, res, next) => {
    try {
    const { matchId } = req.params;
    const { comment } = req.body;
    

    //Valido con zod?
    const { _id: userId } = req.user;
    
    //creo el objeto que se le da de argumento a create
    const dataComment = { creator: userId, comment, match: matchId }
    console.log("estructura de dataComment", dataComment)

    const newComment = await Comment.create(dataComment)
    console.log("aqui el comentario", newComment)
    if (!newComment) {
        throw new HttpError(404, "Error creating comment in DB")
    }
    await Promise.all([
        User.findByIdAndUpdate(userId, {$addToSet: {comments: newComment._id}}),
        Match.findByIdAndUpdate(matchId, {$addToSet: {comments: newComment._id}})
    ])

    res.status(200).json({message: "new comment added", comment: newComment})
    
    } catch (err) {
        next(err)
    }
}
)

//ruta comment list
router.get('/matches/:matchId/commentList', async (req, res, next) => {
    try {
    const { matchId } = req.params;
    //saco los comentarios con la matchId, y populando comment para mostrar los commentarios
    const match = await Match.findById(matchId)
    if (!match) {
        throw new HttpError(404, "Match not found") 
    }
    console.log("ver match", match)
    const matchWithComment = await match.populate('comments')
    console.log("ver la forma de matchwithcomments", matchWithComment)
    const matchComments = matchWithComment.comments.map(m => m.comment)
    
    res.status(200).json({message: "comments retrieves succesfully", matchComments})
    
    } catch (err) {
        next(err)
    }
})







export { router as CommentRouter };