export function errorHandler (error, req, res, next) {
    console.log(error)
    res.status(error.code || 500).json({error: error.message})
}