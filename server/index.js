var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:5000",
        methods: ["GET", "POST"]
    }
});
const cors = require('cors');

// Apply CORS middleware to all routes
app.use(cors());

app.get('/view', (req, res) => {
    res.sendFile(__dirname + '/display.html');
});

io.on('connection', (socket) => {
    console.log("User connected");

    socket.on("join-message", (roomId) => {
        socket.join(roomId);
        console.log("User joined in a room : " + roomId);
    });

    socket.on("screen-data", function(data) {
        data = JSON.parse(data);
        var room = data.room;
        var imgStr = data.image;
        socket.broadcast.to(room).emit('screen-data', imgStr);
    });
});

var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
http.listen(server_port, () => {
    console.log("Started on : " + server_port);
});
