import mongoose from "mongoose"
import {Server } from 'http'
import app from "./app";


let server : Server;
const PORT = 5000;

const startServer = async () => {
    try {
        await mongoose.connect(`mongodb+srv://ph-tour-server:eRIcr4Pqd5NB8J4w@cluster0.riywk8u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
        console.log('connected to db server');
        server = app.listen(PORT, () => {
            console.log(`PH-Tour server listening port is: ${PORT}`)
        })
    } catch (error) {
        console.log(error, 'from server')
    }
}

startServer()