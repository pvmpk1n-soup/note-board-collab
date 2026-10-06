const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" },
});

app.set("io", io);

io.on("connection", (socket) => {
    console.log("A client connected: ", socket.id);

    socket.on("disconnect", () => {
        console.log("A client disconnected: ", socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Running on :${PORT}`));