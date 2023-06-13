import { LIB_MQTT, ENVIRONMENT } from "../config.js";
import { toClient as BACKEND_TOPICS } from "agent_factory.shared/backend_topics.js";
import { MqttProxy } from "mqtt_proxy";
import { TaskRunner } from "js_utils/task_runner";
import { boot } from "./boot.js";
import { parseResponse } from "./parseResponse.js";
import { logBackendResponse, logBackendError } from "../log.js";

// backend client
const backendClient = new LIB_MQTT.connect(ENVIRONMENT.BACKEND_URL, {
  username: ENVIRONMENT.BACKEND_AUTH_USERNAME,
  password: ENVIRONMENT.BACKEND_AUTH_PASSWORD,
});

// backend proxy
const backendProxy = new MqttProxy({
  id: ENVIRONMENT.BACKEND_CLIENT_ID,
  server: backendClient,
  registry: {
    params: { clientId: ENVIRONMENT.BACKEND_CLIENT_ID },
    routes: BACKEND_TOPICS,
    strict: true,
  },
});

// backend events
let BACKEND_CONNECTED = false;
let BACKEND_BOOTED = false;

backendClient.once("connect", () => {
  BACKEND_CONNECTED = true;
});

// task runner
const tr = new TaskRunner({
  timeout: 30000,
  isConnected: function () {
    return BACKEND_CONNECTED && BACKEND_BOOTED;
  },
});

// backend service
const backend = {
  init() {
    if (BACKEND_BOOTED) return;
    const bootInfo = {
      deviceId: ENVIRONMENT.BACKEND_CLIENT_ID,
      roomName: ENVIRONMENT.BACKEND_ROOM_NAME,
      deviceType: ENVIRONMENT.BACKEND_DEVICE_TYPE,
    };
    boot(backendProxy)(bootInfo)
      .then(parseResponse)
      .then(logBackendResponse("/boot", bootInfo))
      .then((res) => {
        BACKEND_BOOTED = true;
      })
      .catch(logBackendError("/boot", bootInfo, true));
  },
  publish(topic, payload, options) {
    return tr
      .run(() => backendProxy.publish(topic, payload, options))
      .then(parseResponse)
      .then(logBackendResponse(topic, payload))
      .catch(logBackendError(topic, payload));
  },
  subscribe(topic, options, listener) {
    return tr
      .run(() => backendProxy.subscribe(topic, options, listener))
      .then(parseResponse)
      .then(logBackendResponse(topic))
      .catch(logBackendError(topic, listener));
  },
};

export default backend;
