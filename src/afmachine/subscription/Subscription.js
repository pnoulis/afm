import { eventful } from "../eventful.js";
import { stateful } from "../stateful.js";
import { Up } from "./StateUp.js";
import { Down } from "./StateDown.js";
import { Pending } from "./StatePending.js";

/*
  Options:
  mode: persistent,
  timeout: 3000,
  persistListeners: true
 */

class Subscription {
  constructor(client = null, topic = "", options = {}) {
    Object.assign(
      this,
      stateful.call(this, {
        down: new Down(this),
        pending: new Pending(this),
        up: new Up(this),
      })
    );
    Object.assign(
      this,
      eventful.call(this, {
        stateChange: [],
        disconnected: [],
        connected: [],
        message: [],
        error: [],
      })
    );
    this.client = client;
    this.topic = topic;
    this.options = { ...this.options, mode: "persistent", ...options };
    this.overseerId = null;
    this.subscriptionId = null;
    this.setState(this.getDownState);
  }

  changeState(state, cb) {
    const currentState = this.state.name;
    this.setState(state, () => {
      this.emit("stateChange", currentState, this.state.name);
      cb && cb();
    });
  }

  #inspectSubscribers() {
    // remove expired subscribers
    const now = Date.now();
    this.events.message = this.events.message.reduce((car, cdr) => {
      if (now >= cdr.timeout) {
        cdr.listener(new Error("Subscription timeout"));
        return car;
      } else {
        return [...car, cdr];
      }
    }, []);

    if (this.events.message.length < 1) {
      this.#killOverseer();
    }
  }

  #spawnOverseer() {
    this.overseerId = setInterval(
      () => this.#inspectSubscribers(),
      this.options.timeout
    );
  }

  #killOverseer() {
    clearInterval(this.overseerId);
  }

  _register(subscriber, options) {
    this.on("message", subscriber, options);
    // if (!this.overseerId) {
    //   this.#spawnOverseer();
    // }
    return () => this._unregister(options.id || subscriber);
  }
  _unregister(subscriber) {
    this.flush("message", subscriber);
  }
  _unsubscribe() {
    return new Promise((resolve, reject) => {
      try {
        this.subscriptionId && this.subscriptionId();
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
  _subscribe() {
    return this.client
      .subscribe(
        this.topic,
        { mode: this.options.mode },
        this.#handleMessage.bind(this)
      )
      .then((unsubscribe) => {
        this.subscriptionId = unsubscribe;
        this.changeState(this.getUpState);
        this.emit("connected");
      })
      .catch((err) => {
        this.changeState(this.getDownState);
        this.emit("error", err);
        this.emit("message", err);
      });
  }

  #handleMessage(err, msg) {
    this.emit("message", err, msg);
  }

  subscribe() {
    return new Promise((resolve, reject) =>
      this.state.subscribe(resolve, reject)
    );
  }
  unsubscribe() {
    return new Promise((resolve, reject) =>
      this.state.unsubscribe(resolve, reject)
    );
  }
  register(subscriber, options) {
    return this.state.register(subscriber, options);
  }
}

export { Subscription };
