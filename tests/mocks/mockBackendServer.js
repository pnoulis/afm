import { LIB_MQTT, ENVIRONMENT } from "../../src/config.js";
import { toServer, toClient } from "agent_factory.shared/backend_topics.js";
import { MqttProxy } from "mqtt_proxy";

// mock backend server
const backendServer = new LIB_MQTT.connect(ENVIRONMENT.BACKEND_URL);

backendServer.on("connect", () => {
  console.log("Mock backend server connected!");
});

// mock backend server proxy
const backendProxy = new MqttProxy({
  id: ENVIRONMENT.BACKEND_CLIENT_ID,
  server: backendServer,
  registry: {
    params: { clientId: ENVIRONMENT.BACKEND_CLIENT_ID },
    routes: toServer,
    strict: false,
  },
});

const NEXT_RESPONSE = [
  function (publish) {
    publish({
      result: "OK",
      message: "MOCK_SERVER_UP",
    });
  },
];

const mockBackendServer = {
  fail(withPayload) {
    NEXT_RESPONSE[0] = function (publish) {
      publish(
        withPayload || {
          result: "NOK",
          timestamp: 12345456789,
        }
      );
    };
  },
  succeed(withPayload) {
    NEXT_RESPONSE[0] = function (publish) {
      publish(
        withPayload || {
          result: "OK",
          timestamp: 12345456789,
        }
      );
    };
  },
  timeout(at) {
    NEXT_RESPONSE[0] = function (publish) {
      setTimeout(() => publish("timeout"), at || 5000);
    };
  },
};

function handleRequest(requestTopic, responseTopic) {
  return function (err, message) {
    console.log(`backend mock server intercepted request for:${requestTopic}`);
    NEXT_RESPONSE[0]((payload) => {
      backendProxy.publish(responseTopic, payload);
    });
  };
}

// listen for all backend requests
toServer.forEach(
  ({ alias, pub, sub }) =>
    sub &&
    backendProxy
      .subscribe(alias, (err, message) => {
        handleRequest(sub, pub)(null, message);
      })
      .then((subed) => {
        console.log(`listening to:${sub}`);
      })
      .catch((err) => {
        console.log(`error trying to subscribe to topic:${sub}`);
      })
);

export { mockBackendServer };
