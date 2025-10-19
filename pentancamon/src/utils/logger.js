import pino from "pino";

export const logger = pino({
    level: process.env.PINO_LOG_LEVEL || 'info'    //aqui elijo el nivel con .env si no el nivel es info
})


