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
  console.log("username: ", player?.username || "");
  console.log("name: ", player?.name || "");
  console.log("surname: ", player?.surname || "");
  console.log("email: ", player?.email || "");
  console.log("password: ", player?.password || "");
  console.log("state >>> ", player?.getState?.().name || player?.state || "");
  logWristband(player.wristband || {});
  console.log("------------------------------");
}

function logWristband(wristband) {
  console.log("id: ", wristband?.id ?? null);
  console.log("color: ", wristband?.color ?? null);
  console.log(
    "state >>> ",
    wristband?.getState?.().name || wristband?.state || "",
  );
}

function logRoster(roster) {
  if (roster instanceof Array) {
    roster.forEach((p) => logPlayer(p));
  } else if (roster instanceof Map) {
    for (const [k, v] of roster) {
      logPlayer(v);
    }
  } else if (roster?.roster?.roster) {
    for (const [k, v] of roster.roster.roster) {
      logPlayer(v);
    }
  } else {
    for (const [k, v] of roster.roster) {
      logPlayer(v);
    }
  }
}

function logTeam(team) {
  console.log("name: ", team?.name || "");
  console.log("points: ", team?.points ?? null);
  console.log("state >>> ", team?.getState?.().name || team?.state || "");
  logRoster(team?.roster);
}
export { logStateChange, logPlayer, logWristband, logRoster, logTeam };
