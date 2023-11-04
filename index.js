const express = require("express")
const http = require("http")
const { createBareServer } = require("@tomphttp/bare-server-node")
const ejs = require("ejs")
const games = require("./games.json")

const app = express();
const server = http.createServer(app);
const bareServer = createBareServer("/bare/");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public');
app.use(express.static('public'))
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
app.get('/play/:game?', (req, res) => {
  if(!req.params.game) {
    res.redirect("/games")
  } else {
  res.render('player', { game: req.params.game });
  }
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
  } else {
    socket.end();
  }
});

server.on("listening", () => {
  console.log(`Listening on port ${port}`);
});

server.listen(port);
