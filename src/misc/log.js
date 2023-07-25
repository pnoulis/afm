function logStateChange() {
  return [
    "stateChange",
    function (currentState, previousState) {
      console.log(`[TRANSITION] ${previousState} >>> ${currentState}`);
    },
  ];
}

function logPlayer(player) {
  console.log("------------------------------");
  console.log("username: ", player.username);
  console.log("name: ", player.name);
  console.log("surname: ", player.surname);
  console.log("email: ", player.email);
  console.log("password: ", player.password);
  console.log("state >>> ", player.getState?.().name || player.state);
  logWristband(player.wristband);
  console.log("------------------------------");
}

function logWristband(wristband) {
  console.log("id: ", wristband.id);
  console.log("color: ", wristband.color);
  console.log("state >>> ", wristband.getState?.().name || wristband.state);
}
export { logStateChange, logPlayer, logWristband };
