import { eventful } from "js_utils/eventful";

function BrowserService() {
  this.state = this.getState();
}

BrowserService.prototype.getState = function getState() {
  if (document.visibilityState === "hidden") {
    return "hidden";
  }

  if (document.hasFocus()) {
    return "active";
  }
  return "passive";
};

eventful(BrowserService, {
  stateChange: [],
  unload: [],
});

const browserService = new BrowserService();

["pageshow", "focus", "blur", "visibilitychange", "resume", "unload"].forEach(
  (type) => {
    window.addEventListener(type, function handleEvent({ type: event, ...e }) {
      const nextState = browserService.getState();
      if (nextState !== browserService.state) {
        console.log(`State change: ${browserService.state} >>> ${nextState}`);
        browserService.state = nextState;
        browserService.emit("stateChange", event, nextState, { capture: true });
      }
      browserService.emit(event, e);
    });
  }
);

browserService.once("unload", function () {
  ["pageshow", "focus", "blur", "visibilitychange", "resume", "unload"].forEach(
    function (event) {
      window.removeEventListener(event, handleEvent);
    }
  );
});

// window.addEventListener("freeze", () => {
//   logStateChange("frozen");
// });

// window.addEventListener(
//   "pagehide",
//   (event) => {
//     logStateChange(event.persisted ? "frozen" : "terminated");
//   },
//   opts
// );

export default {};
