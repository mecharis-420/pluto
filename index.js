import express from "express";
import http from "node:http";
import createBareServer from "@tomphttp/bare-server-node";

const ejs = require('ejs');

const server = http.create(server);
const app  = express(server);
const bareServer = createBareServer("/bare/")
const games = require("./games.json")


const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public');

app.get('/', (req, res) => {
  res.render('index');
});
app.get('/discord', (req, res) => {
  res.redirect("https://discord.gg/8GxV2jx3AS");
});
app.get('/web', (req, res) => {
  res.render('proxy');
});
app.get('/games', (req, res) => {
  res.render('games', { games });
});
app.get('/*', (req, res) => {
  res.render('404', { url: req.url });
});

server.on("request", (req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  }else{
    socket.end();
  }
});

server.on("listening", () => {
  console.log(`Listening on port ${port}`);
});

server.listen({
});