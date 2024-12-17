const http = require("http"),
    fs = require("fs"),
    socketio = require("socket.io");


const port = 3456;
const file = "client.html";
const express = require('express');
const app = express();


const server = http.createServer(function (req, res) {
    fs.readFile(file, function (err, data) {
        if (err) return res.writeHead(500);
        res.writeHead(200);
        res.end(data);
    });
});


server.listen(port);
const io = socketio(server);


// Store chat rooms, users, and room bans
const rooms = {};
const users = {};
const roomActivity = {};

io.on("connection", function (socket) {
    console.log("New user connected:", socket.id);

    // Join the main lobby on connect
    socket.join("Lobby");
    users[socket.id] = { nickname: "Anonymous", room: "Lobby" };
    updateUserList("Lobby");

    // Emit the current room list to all clients, including the newly connected user
    socket.emit("room_list", Object.keys(rooms));
    io.emit("room_list", Object.keys(rooms)); // Emit to all clients

    // Handle setting nickname
    socket.on("set_nickname", function (nickname) {
        users[socket.id].nickname = nickname;
        io.to(socket.id).emit("nickname_set", nickname);
    });

    socket.on("create_room", function ({ roomName, password }) {
        const user = users[socket.id];

        if (!user.nickname || user.nickname === "Anonymous") {
            return io.to(socket.id).emit("room_error", "You must set a nickname before creating a room.");
        }

        if (rooms[roomName]) {
            return io.to(socket.id).emit("room_error", "Room name is already taken.");
        }

        // Create the room if all checks pass
        rooms[roomName] = {
            users: [socket.id], // Store socket.id instead of user object
            password: password || null,
            bannedUsers: [],
            creator: socket.id // Store the creator's socket.id
        };
        roomActivity[roomName] = { joined: [], left: [] };
        io.emit("room_list", Object.keys(rooms)); // Emit updated room list to all clients
        const me = user.nickname; // The string to send
        io.to(socket.id).emit("user_list", me);
        io.to(socket.id).emit("room_created", roomName);

    });


    socket.on("join_room", function ({ roomName, password }) {
        const room = rooms[roomName];
        const user = users[socket.id];

        if (!room) {
            return io.to(socket.id).emit("room_error", "Room does not exist.");
        }

        if (room.bannedUsers.includes(socket.id)) {
            return io.to(socket.id).emit("room_error", "You are banned from this room.");
        }

        if (room.password && room.password !== password) {
            return io.to(socket.id).emit("room_error", "Incorrect password.");
        }

        // Leave the previous room and join the new one
        socket.leave(user.room);
        user.room = roomName;
        socket.join(roomName);

        room.users.push(socket.id);
        roomActivity[roomName].joined.push({ userId: socket.id, nickname: user.nickname });
        alert('Room Activity (Joined):', roomActivity);
        // Emit the user list to the newly joined user
        const userList = room.users
            .filter(id => users[id]) // Filter out any undefined users
            .map(id => users[id].nickname);
        io.to(socket.id).emit("user_list", userList);  // Send user list immediately to the joining user
        // Update the user list for all users in the room
        io.to(socket.id).emit("current_room", { roomName: user.room });
        updateUserList(roomName);
        const message = `${users[socket.id].nickname} has joined the room: ${roomName}`;
        io.to(roomName).emit("message_to_client", { message, name: "Server" });

    });

    // Handle sending messages within a room
    socket.on("message_to_room", function (message) {
        const user = users[socket.id];
        // Check if user is in a room
        if (user.room === "Lobby") {
            return io.to(socket.id).emit("room_error", "You must join a room to send a message.");
        }
        io.to(user.room).emit("message_to_client", { message, name: user.nickname });
    });


    // Handle user disconnect
    socket.on("disconnect", function () {
        const user = users[socket.id];
        if (user) {
            const roomName = user.room; // Get the room name
            delete users[socket.id];
            updateUserList(roomName); // Update user list for the room
            if (roomActivity[roomName]) {
                roomActivity[roomName].left.push({ userId: socket.id, nickname: user.nickname });
            }


            // Notify other users in the room about the user leaving
            const message = `${user.nickname} has left the room: ${roomName}`;
            io.to(roomName).emit("message_to_client", { message, name: "Server" }); // Send a message from the server
        }
    });



    socket.on("direct_message", function ({ recipientId, message }) {
        // Check if the recipient exists
        if (users[recipientId]) {
            // Send the message to the recipient
            io.to(recipientId).emit("direct_message", {
                message,
                name: users[socket.id].nickname
            });
        } else {
            // Optionally inform the sender if the recipient doesn't exist
            io.to(socket.id).emit("room_error", "User does not exist.");
        }
    });

    socket.on("kick_user", function (userId) {
        const roomName = users[socket.id].room;
        const room = rooms[roomName];

        // Check if the user is in a room and if the kicker is the room creator
        if (room && room.creator === socket.id) {
            // Check if the user being kicked is in the same room
            if (room.users.includes(userId)) {
                const kickedUser = users[userId];

                // Move the kicked user back to the Lobby
                const kickedSocket = io.sockets.sockets.get(userId);
                if (kickedSocket) {
                    kickedSocket.leave(roomName); // Leave current room
                    kickedSocket.join("Lobby"); // Join the Lobby room
                    kickedUser.room = "Lobby"; // Update room on server-side user info

                    // Notify the kicked user
                    kickedSocket.emit("kicked_from_room", "You have been kicked from the room.");

                    // Update room name on the client side for the kicked user
                    kickedSocket.emit("current_room", { roomName: "Lobby" });

                    // Remove the kicked user from the room's user list
                    room.users = room.users.filter(id => id !== userId);

                    // Update user lists for both rooms
                    updateUserList(roomName); // Update the kicked user's old room
                    updateUserList("Lobby"); // Update the Lobby
                }
            } else {
                io.to(socket.id).emit("room_error", "User is not in your room.");
            }
        } else {
            io.to(socket.id).emit("room_error", "Only the room creator can kick users.");
        }
    });
    // Handle banning a user
    socket.on("ban_user", function (userId) {
        const roomName = users[socket.id].room;
        const room = rooms[roomName];

        // Check if the user is in a room and if the banner is the room creator
        if (room && room.creator === socket.id) {
            // Check if the user being banned is in the same room
            if (room.users.includes(userId)) {
                const bannedUser = users[userId];

                // Add the user to the banned list of the room
                room.bannedUsers.push(userId);

                // Disconnect banned user from the room
                const bannedSocket = io.sockets.sockets.get(userId);
                if (bannedSocket) {
                    bannedSocket.leave(roomName); // Leave current room
                    bannedSocket.join("Lobby"); // Move to the Lobby
                    bannedUser.room = "Lobby"; // Update room info

                    // Notify the banned user that they have been banned
                    bannedSocket.emit("banned_from_room", "You have been permanently banned from the room.");

                    // Update the UI for the banned user
                    bannedSocket.emit("current_room", { roomName: "Lobby" });

                    // Remove the banned user from the room's user list
                    room.users = room.users.filter(id => id !== userId);

                    // Update user lists for both rooms
                    updateUserList(roomName); // Update the kicked user's old room
                    updateUserList("Lobby");  // Update the Lobby
                }
            } else {
                io.to(socket.id).emit("room_error", "User is not in your room.");
            }
        } else {
            io.to(socket.id).emit("room_error", "Only the room creator can ban users.");
        }
    });



    // Update user list in the room
    function updateUserList(roomName) {
        const roomUsers = Object.keys(users)
            .filter(id => users[id].room === roomName)
            .map(id => ({ id, nickname: users[id].nickname }));

        io.to(roomName).emit("user_list", roomUsers); // Emit updated list to all users in room
    }

});