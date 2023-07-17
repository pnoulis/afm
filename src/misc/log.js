function logStateChange(currentState, previousState) {
  console.log(`[TRANSITION] ${previousState} >>> ${currentState}`);
}
export {
  logStateChange,
};
