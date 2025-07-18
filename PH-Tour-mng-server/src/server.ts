import mongoose from "mongoose"
import { Server } from 'http'
import app from "./app";
import { envVars } from "./config/env";


let server: Server;
const PORT = 5000;

const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL);
        console.log('connected to db server');
        server = app.listen(envVars.PORT, () => {
            console.log(`PH-Tour server listening port is: ${envVars.PORT}`)
        })
    } catch (error) {
        console.log(error, 'from server')
    }
}

startServer()


process.on("unhandledRejection", (error) => {
    console.log('Unhandle Rejection...', error)
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})


process.on("uncaughtException", (error) => {
    console.log('Uncaught Exception Rejection...', error)
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})

process.on("SIGTERM", () => {
    console.log('Sigterm Exception Rejection...')
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})

// Promise.reject(new Error('I forgot to caught this error'))
// throw new Error('I forgot to caught this error')