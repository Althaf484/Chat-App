const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");

const {addUser, removeUser, getUser, getUsersInRoom} = require("./users")

const router = require("./router")

const PORT = process.env.PORT || 5000;

const app = express();
const server =  http.createServer(app);
const io = socketio(server, {
    cors: {
      origin: "http://localhost:5173", // Vite default port
      methods: ["GET", "POST"]
    }
  });

app.use(cors());
app.use(router);

io.on("connection", (socket) => {
    console.log("We have new connection")

    socket.on("join", ({name, room}, callback) => {

      const {error,user} = addUser({id: socket.id, name, room});
      console.log(error,user)
      if(error) return callback(error);

      socket.emit("message", {user: "admin", text: `${user.name} welcome to the ${user.room}`});
      socket.broadcast.to(user.room).emit("message", {user: "admin", text: `${user.name} has joined`});

      socket.join(user.room);

      callback();
    })

    socket.on("sendMessage", (message, callback) =>{
      const user = getUser(socket.id);

      io.to(user.room).emit("message", {user: user.name, text: message});

      callback();
    })

    socket.on("disconnect", () => {
        console.log("User had left")
    })
})


server.listen(PORT , () =>{
    console.log(`Server is running on ${PORT}`);
})