import { exec } from "node:child_process";
import { LIB_MOTT } from "../src/config.js";

const p = "gregoris/MQTT_API_Emulator/main.py";

let tries = 0;
function runPythonScript(tries) {
  return new Promise((resolve, reject) => {
    if (tries > 1) {
      reject(new Error("Could not run python script"));
    }

    exec("ps aux | grep 'python.*./main.py$'", (err, stdout, stderr) => {
      if (err) {
        return runPythonScript(tries + 1);
      } else {
        resolve();
      }
    });
  });
}

runPythonScript().then();
