import { generateRandomName, randomInteger } from "js_utils/misc";

function randomPlayer() {
  const username = `${generateRandomName()}_${randomInteger(1, 1000)}`;
  const [name, surname, password] = username.split("_");
  return {
    username,
    email: `${username}@gmail.com`,
    name,
    surname,
    password,
  };
}

export { randomPlayer };
