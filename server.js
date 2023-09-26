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

let gameState = []

console.log(`running on ws://127.0.0.1:${port}`)

wss.on('connection', (ws) => {

  ws.on('message', message => {
    let data = JSON.parse(message)
    
    if(gameState.filter(el => el.id == data.id).length > 0) {
    	gameState = gameState.map(el => {
    		if(el.id == data.id) return data
    		else return el
    	})
    } else {
    	console.log(`new player, id: ${data.id}`)
	  	gameState.push(data)
    }

    ws.send(JSON.stringify(gameState))
  })

  ws.on('close', (code, reason) => {
  	gameState = gameState.filter(el => el.id != parseInt(reason))
  	console.log(`player ${reason} disconnected`)
  })
 
});