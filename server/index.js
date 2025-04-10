const express = require("express");
const http = require("http");
const socketio = require("socket.io")

const router = require("./router")

const PORT = process.env.PORT || 5000;

const app = express();
const server =  http.createServer(app);
const io = socketio(server)

app.use(router);

io.on("connection", (socket) => {
    console.log("We have new connection")


    socket.on("disconnect", () => {
        console.log("User had left")
    })
})


server.listen(PORT , () =>{
    console.log(`Server is running on ${PORT}`);
})