const express = require("express");
const app = express();
const path = require('path');
const { readFile } = require("fs").promises;


// Paths
const paths = require("./config/paths")
const publicPath = paths.public


// Live reload
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(publicPath);

liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
        liveReloadServer.refresh('/');
    }, 500);
});


// Middleware
app.use(connectLivereload());
app.use(express.json());
app.use(express.static(publicPath));


// Routing
app.get("/", async (request, response) => {
    response.send( await readFile(path.join(publicPath, "index.html"), "utf8"));
});


app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on http://localhost:3000/. To stop the server, press Ctrl + C");
});