function packageListener(listener, options = {}) {
  return {
    listener,
    persistent: options.persist ?? this.options.persistListeners,
    timeout: Date.now() + (options.timeout || this.options.timeout),
    ...options,
  };
}
function ensureEvent(event) {
  if (!Object.hasOwn(this.events, event)) {
    const ERR_UNRECOGNIZED_EVENT = new Error(`Unrecognized event: ${event}`);
    this.emit("error", ERR_UNRECOGNIZED_EVENT);
    throw ERR_UNRECOGNIZED_EVENT;
  }
}

function on(event, listener, options) {
  this.ensureEvent(event);
  this.events[event].push(this.packageListener(listener, options));
  return this;
}

function once(event, listener, options) {
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
    (subscriber) => subscriber.listener && subscriber.listener(...args, this)
  );
  this.events[event] = this.events[event].filter(({ listener, persistent }) => {
    return persistent;
  });
  return this;
}

function eventful(events = {}, options = {}) {
  return {
    events: {
      error: [],
      ...events,
    },
    options: {
      persistListeners: true,
      timeout: 30000,
      ...options,
    },
    packageListener: this.packageListener || packageListener.bind(this),
    ensureEvent: ensureEvent.bind(this),
    on: on.bind(this),
    once: once.bind(this),
    flush: flush.bind(this),
    emit: emit.bind(this),
  };
}

export { eventful };
