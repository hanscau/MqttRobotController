const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const mqtt = require("mqtt");

var client = mqtt.connect("mqtt://localhost");

var publish = (topic, payload) => {
  console.log(`Send ${payload} to ${topic}`);
};

var broker = "localhost";

io.on("connection", (socket) => {
  console.log("[Info] user connected");

  socket.on("/robot/movement/control", (payload) => {
    console.log("[Controller] Update robot control", JSON.stringify(payload, null, 2));
    publish("/robot/movement/control", JSON.stringify(payload));
  });

  socket.on("/robot/camera/control", (payload) => {
    console.log("[Controller] Update camera control", JSON.stringify(payload, null, 2));
    publish("/robot/camera/control", JSON.stringify(payload));
  });

  socket.on("/connect", (address) => {
    broker = address;
    console.log("[Info] Connecting to mqtt", broker, "...");
    client = mqtt.connect(`mqtt://${broker}`);

    client.on("connect", () => {
      console.log("[Info] Connected to mqtt");
      client.subscribe("/robot/task");
      client.subscribe("/robot/taskreq/status");


      publish = (topic, payload) => {
        client.publish(topic, payload);
      };

      io.emit("/connected", broker);
    });
  });
});

http.listen(4000, () => {
  console.log("[Info] listening on port 4000");
});
