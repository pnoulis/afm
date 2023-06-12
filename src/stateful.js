import { capitalize } from "js_utils/misc";

function stateful(states = {}, options = {}) {
  const stateNames = Object.keys(states);
  const stateInstances = Object.values(states);

  // define a states array in the CALLING CONTEXT
  if (!Object.hasOwn(this.constructor, "states")) {
    Object.defineProperty(this.constructor, "states", {
      enumerable: true,
      configurable: false,
      writable: false,
      value: stateNames,
    });
  }

  stateInstances.forEach((state, i) => {
    // define a name property in each STATE INSTANCE
    Object.defineProperty(state, "name", {
      enumerable: true,
      configurable: false,
      get: function () {
        return stateNames[i];
      },
    });

    // define an index property in each STATE INSTANCE
    Object.defineProperty(state, "index", {
      enumerable: true,
      configurable: false,
      get: function () {
        return i;
      },
    });

    // define getters for each state in the CALLING CONTEXT
    Object.defineProperty(this, `get${capitalize(state.name)}State`, {
      enumerable: true,
      get: function () {
        return state;
      },
    });
  });

  return {
    states,
    options: {
      ...options,
    },
    state: this.state,
    getState: getState.bind(this),
    setState: setState.bind(this),
    inState: inState.bind(this),
    compareStates: compareStates.bind(this),
  };
}
function getState() {
  return this.state.name;
}
function setState(state, cb) {
  this.state = state;
  this.state.init && this.state.init();
  cb && cb();
  return this;
}
function inState(state) {
  return state === this.state.name || state === this.state.index;
}
function compareStates(cb) {
  return cb(
    this.constructor.states.reduce((car, cdr, i) => ({ ...car, [cdr]: i }), {}),
    this.state.index
  );
}

export { stateful };
