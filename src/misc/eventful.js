/**
 * Eventful
 *
 * @typedef {Object} eventful
 * @property {Array<Object>} events
 **/
function eventful(target, events = {}) {
  // A Function object
  const self = target;
  // An Object
  const prototype = self.prototype;

  Object.defineProperties(prototype, {
    events: {
      value: events,
      enumerable: true,
      writable: true,
    },
    packageListener: {
      value: packageListener,
      enumerable: true,
      writable: false,
    },
    ensureEvent: {
      value: ensureEvent,
      enumerable: true,
      writable: false,
    },
    on: {
      value: on,
      enumerable: true,
      writable: false,
    },
    once: {
      value: once,
      enumerable: true,
      writable: false,
    },
    flush: {
      value: flush,
      enumerable: true,
      writable: false,
    },
    emit: {
      value: emit,
      enumerable: true,
      writable: false,
    },
  });
}

function packageListener(listener, options = {}) {
  return {
    listener,
    persistent: options.persist ?? true,
  };
}
function ensureEvent(event) {
  if (!Object.hasOwn(this.events, event)) {
    const ERR_UNRECOGNIZED_EVENT = new Error(`Unrecognized event: ${event}`);
    this.emit("error", ERR_UNRECOGNIZED_EVENT);
    throw ERR_UNRECOGNIZED_EVENT;
  }
}

function on(event, listener) {
  this.ensureEvent(event);
  this.events[event].push(this.packageListener(listener, { persist: true }));
  return this;
}

function once(event, listener) {
  this.ensureEvent(event);
  this.events[event].push(this.packageListener(listener, { persist: false }));
  return this;
}

function flush(event, listener, clause) {
  if (/^\*$/.test(event)) {
    return Object.keys(this.events).forEach((event) =>
      this.flush(event, listener, clause)
    );
  }
  this.ensureEvent(event);
  if (typeof listener === "function") {
    this.events[event] = this.events[event].filter(
      (subscriber) => subscriber.listener !== listener
    );
  } else if (typeof listener === "string") {
    this.events[event] = this.events[event].filter(
      (subscriber) => subscriber.id !== listener
    );
  } else if (typeof clause === "function") {
    this.events[event] = this.events[event].reduce(
      (car, cdr) => (clause(cdr) ? car : [...car, cdr]),
      []
    );
  } else {
    this.events[event] = [];
  }
  return this;
}

function emit(event, ...args) {
  this.ensureEvent(event);
  [...this.events[event]].forEach(
    (subscriber) => subscriber.listener && subscriber.listener(...args)
  );
  this.events[event] = this.events[event].filter(({ listener, persistent }) => {
    return persistent;
  });
  return this;
}

export { eventful };
