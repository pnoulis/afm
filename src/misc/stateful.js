/**
 * Stateful
 *
 * @typedef {Object} stateful
 * @property {Object<State>} states
 * @property {State} state
 * @property {function} getStateName
 * @property {function} getState
 * @property {function} setState
 * @property {function} inState
 * @property {function} compareStates
 */

function stateful(target, states = {}) {
  // A Function object
  const self = target;
  // An Object
  const prototype = target.prototype;
  const stateNames = Object.keys(states);
  const stateInstances = Object.values(states);

  stateInstances.forEach((state, i) => {
    // define a name property in each STATE INSTANCE
    Object.defineProperty(state.prototype, "name", {
      enumerable: true,
      configurable: false,
      get: function () {
        return stateNames[i];
      },
    });

    // define an index property in each STATE INSTANCE
    Object.defineProperty(state.prototype, "index", {
      enumerable: true,
      configurable: false,
      get: function () {
        return i;
      },
    });

    // define getters for each state in the CALLING CONTEXT
    Object.defineProperty(prototype, `get${state.name}State`, {
      enumerable: true,
      configurable: false,
      get: function () {
        return this.states[i];
      },
    });
  });

  // define properties in the CALLING CONTEXT PROTOTYPE
  Object.defineProperties(prototype, {
    statefulConstructor: {
      value: statefulConstructor,
      enumerable: true,
      writable: false,
      configurable: false,
    },
    states: {
      value: stateInstances,
      enumerable: true,
      writable: true,
      configurable: true,
    },
    state: {
      value: null,
      enumerable: true,
      writable: true,
    },
    getState: {
      value: getState,
      enumerable: true,
      writable: false,
    },
    setState: {
      value: setState,
      enumerable: true,
      writable: false,
    },
    inState: {
      value: inState,
      enumerable: true,
      writable: false,
    },
    compareStates: {
      value: compareStates,
      enumerable: true,
      writable: false,
    },
  });
}

function statefulConstructor() {
  this.states = Object.values(this.states).map((state) => new state(this));
  this.setState(this.states[0]);
}

function getState() {
  return this.state.name;
}
function setState(state, cb) {
  const previousState = this.state?.name;
  this.state = state;
  this.state.init && this.state.init();
  cb && cb();
  this.emit && this.emit("stateChange", this.state.name, previousState);
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
