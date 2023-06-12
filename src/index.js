import backend from "./backend/backend.js";
import { Player } from "./player/index.js";
backend.init();

const pavlos = {
  username: "something",
  name: "yolo",
  surname: "yolo3",
  email: "email@gmail.com",
  password: "yololool",
};

const newPlayer = new Player();
newPlayer
  .register(pavlos)
  .then((registered) => {
    console.log("registered");
  })
  .catch((err) => {
    console.log("error");
  });
