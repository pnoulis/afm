function logStateChange() {
  return [
    "stateChange",
    function (currentState, previousState) {
      console.log(`[TRANSITION] ${previousState} >>> ${currentState}`);
    },
  ];
}
export { logStateChange };
