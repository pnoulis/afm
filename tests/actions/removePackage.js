import { describe, it, expect, vi, beforeAll } from "vitest";
import { generateRandomName } from "js_utils";
import { randomWristband } from "../../scripts/randomWristband.js";
import { randomPlayer } from "../../scripts/randomPlayer.js";
import { emulateScan } from "../../scripts/emulateScan.js";
import backendClientService from "../../src/backend/backend.js";
import * as Errors from "../../src/errors.js";
import {
  registerPlayer,
  registerWristband,
  mergeTeam,
  addPackage,
} from "../../src/backend/actions/index.js";

/* REMOVE PACKAGE */
import { removePackage } from "../../src/backend/actions/removePackage.js";

describe("removePackage", () => {});
