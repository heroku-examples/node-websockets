const WebSocket = require('ws')
const gdCom = require('@gd-com/utils')

const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', ws => {
  console.log('connected')
  ws.on('message', (message) => {
    let recieveBuff = Buffer.from(message)
    let recieve = gdCom.getVar(recieveBuff)
    console.log(recieve.value)

    let buffer = gdCom.putVar(Math.random())
    ws.send(buffer)
  })
})


// 'use strict';

// const express = require('express');
// const { Server } = require('ws');

// const PORT = process.env.PORT || 3000;
// const INDEX = '/index.html';

// let gameState = []

// const server = express()
//   // .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
//   .listen(PORT, () => console.log(`Listening on ${PORT}`));

// const wss = new Server({ server });

// wss.on('connection', (ws) => {
//   console.log('Client connected');
//   ws.on('close', () => console.log('Client disconnected'));
//   ws.on('message', message => {
//     let data = JSON.parse(message)
    
//     if(gameState.filter(el => el.id == data.id).length > 0) {
//     	gameState = gameState.map(el => {
//     		if(el.id == data.id) return data
//     		else return el
//     	})
//     } else {
//     	console.log(`new player, id: ${data.id}`)
// 	  	gameState.push(data)
//     }

//     ws.send(JSON.stringify(gameState))
//   })
//   ws.on('close', (code, reason) => {
//   	gameState = gameState.filter(el => el.id != parseInt(reason))
//   	console.log(`player ${reason} disconnected`)
//   })

// });



// setInterval(() => {
//   wss.clients.forEach((client) => {
//     client.send(new Date().toTimeString());
//   });
// }, 1000);
