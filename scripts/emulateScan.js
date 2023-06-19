import { exec, spawn } from "node:child_process";
import { backendClient } from "../src/backend/backend.js";
import process from "node:process";
import path from "node:path";
import fs from "node:fs";

function getPackageDir(directory = process.cwd()) {
  const files = fs.readdirSync(directory, { encoding: "utf8" });
  for (const file of files) {
    if (file === "package.json") return directory;
  }
  return getPackageDir(path.resolve(directory, "../"));
}

const afmachinedir = getPackageDir();
const agentFactorydir = path.resolve(afmachinedir, "../", "../");
const pythonScript = path.resolve(
  agentFactorydir,
  "gregoris/MQTT_API_Emulator/main.py"
);

function runPythonScript(tries) {
  return new Promise((resolve, reject) => {
    if (tries > 1) {
      reject(new Error("Could not run python script"));
    }
    exec("ps aux | grep 'python.*./main.py$'", (err, stdout, stderr) => {
      if (err) {
        spawn("python", [pythonScript], {
          stdio: "ignore",
          detached: true,
        }).unref();
        return runPythonScript(tries + 1);
      } else {
        resolve();
      }
    });
  });
}

function emulateScan(number = "r", color = "r") {
  return runPythonScript(0)
    .then(() => {
      return backendClient.publish(
        `/themaze/registration5/emulateScan/${number}/${color}`
      );
    })
    .catch((err) => console.log(err));
}

export { emulateScan };
