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
} from "../../src/backend/actions/index.js";

/* ADD PACKAGE */
import { addPackage } from "../../src/backend/actions/addPackage.js";

describe("addPackage", () => {});
