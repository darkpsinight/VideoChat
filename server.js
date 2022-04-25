const express = require('express')
const app = express()
const { v4: uuidv4 } = require("uuid");
const server = require("http").Server(app);
const io = require("socket.io")();
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
    debug: true,
});



app.use("/peerjs", peerServer);
app.set('view engine', 'ejs')                      //'view engine' = default engine , 'ejs' = extension
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
});
app.get("/:room", (req, res) => {
    res.render("room", { roomId: req.params.room });
});
io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected", userId);
    });
});



app.listen(3030, () => {
    console.log('Server is runing on port 3030');
})