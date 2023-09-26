'use strict';

const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

// wss.on('connection', (ws) => {
//   console.log('Client connected');
//   ws.on('close', () => console.log('Client disconnected'));
// });

// setInterval(() => {
//   wss.clients.forEach((client) => {
//     client.send(new Date().toTimeString());
//   });
// }, 1000);


// Create an object to store room information
const rooms = {};

// Function to generate a random short code
function generateShortCode(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
}

wss.on('connection', (ws) => {
  // Handle WebSocket connections here

  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type === 'createRoom') {
      // Generate a unique short code for the room (e.g., 4 characters)
      let roomCode;
      do {
        roomCode = generateShortCode(4); // Adjust the length as needed
      } while (rooms[roomCode]);

      // Store the room information
      rooms[roomCode] = {
        players: [ws], // Store the first player in the room
      };

      // Send the room code back to the user
      ws.send(JSON.stringify({ type: 'roomCode', code: roomCode }));
    } else if (parsedMessage.type === 'joinRoom') {
      const roomCode = parsedMessage.code;

      // Check if the room exists
      if (rooms[roomCode]) {
        // Add the user to the room
        rooms[roomCode].players.push(ws);

        // Send a message to confirm joining
        ws.send(JSON.stringify({ type: 'joinedRoom', code: roomCode }));
      } else {
        // Send an error message if the room doesn't exist
        ws.send(JSON.stringify({ type: 'roomNotFound', message: 'Room not found' }));
      }
    }

    // Handle other message types as needed
  });

  ws.on('close', () => {
    // Handle WebSocket close event and remove the user from the room
    // You'll need to implement this part based on your requirements
  });
});
