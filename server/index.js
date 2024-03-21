import express from "express"
import {Server} from "socket.io"
import {createServer} from "http"
import cors from "cors"
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const port = process.env.PORT ||  8080
const app = express()
app.use(cors())
const server = createServer(app);
const __dirname = dirname(fileURLToPath(import.meta.url));
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

const io = new Server(server, {
    cors:{
        origin:"*",
        methods:["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials:true
    }
})

io.on("connection", (socket)=>{
    console.log("User Connection ID: "+socket.id)

    socket.on("message", ({room, message})=>{
        console.log({room, message});
        socket.to(room).emit("receive-message", message)
    })

    socket.on("join-room", (room)=>{
        console.log(`User ID: ${socket.id} joined the room: ${room}`);
        socket.join(room)
    })

    socket.on("disconnect", ()=>{
        console.log("User Disconnected ID: "+socket.id)
    })
})


server.listen(port , ()=>{
    console.log("listening on port "+port)
})

