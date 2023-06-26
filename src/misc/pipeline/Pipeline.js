import { Route } from "./Route.js";
class Pipeline {
  constructor() {
    this.globalLast = null;
    this.beforeAll = [];
    this.beforeEach = [];
    this.afterAll = [];
    this.afterEach = [];
  }
}

// This middleware is always the last to be invoked.
// It's behavior changes based on 3 conditions.

/*
  This middleware is always the last to be invoked.
  It's behavior is dependent on 3 cases:

  1. In case of an error being supplied as the last argument
     a. If a pipelines.globalErrHandler has been defined
        the error is handed over.
     b. If a pipelines.globalErrHandler has not been defined
        the error is written to stderr.

  2. In case of it being the last of an error-less pipeline
     it will do nothing and simply return.
 */
Pipeline.prototype.last = function last(callGlobalLast, context, next, err) {
  if (callGlobalLast && this.globalLast) {
    return this.globalLast(context, err);
  } else {
    if (err) throw err;
  }
};

Pipeline.prototype.flush = function flush() {
  this.globalLast = null;
  this.beforeAll.splice(0, this.beforeAll.length);
  this.beforeEach.splice(0, this.beforeEach.length);
  this.afterAll.splice(0, this.afterAll.length);
  this.afterEach.splice(0, this.afterEach.length);
};

Pipeline.prototype.setGlobalLast = function globalLast(handler) {
  this.globalLast = handler;
};

Pipeline.prototype.setBeforeAll = function beforeAll(...middleware) {
  this.beforeAll.push(...middleware);
};

Pipeline.prototype.setBeforeEach = function beforeEach(...middleware) {
  this.beforeEach.push(...middleware);
};

Pipeline.prototype.setAfterAll = function afterAll(...middleware) {
  this.afterAll.push(...middleware);
};

Pipeline.prototype.setAfterEach = function afterEach(...middleware) {
  this.afterEach.push(...middleware);
};

Pipeline.prototype.route = function (route, ...middleware) {
  return new Route(this, route, ...middleware);
};

export { Pipeline };
