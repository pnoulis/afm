const pipelines = {
  globalErrHandler: null,
  beforeAll: [],
  beforeEach: [],
  afterAll: [],
  afterEach: [],
};

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
function lastMiddleware(context, next, err) {
  if (err) {
    if (pipelines.globalErrHandler == null) {
      throw err;
    } else {
      pipelines.globalErrHandler(context, err);
    }
  }
}

function clearAll() {
  pipelines.beforeAll = [];
  pipelines.afterAll = [];
  pipelines.beforeEach = [];
  pipelines.afterEach = [];
  pipelines.globalErrHandler = null;
}
function registerGlobalErrorHandler(handler) {
  pipelines.globalErrHandler = handler;
}
function beforeAllMiddleware(...middleware) {
  pipelines.beforeAll.push(...middleware);
}

function beforeEachMiddleware(...middleware) {
  pipelines.beforeEach.push(...middleware);
}

function afterAllMiddleware(...middleware) {
  pipelines.afterAll.push(...middleware);
}

function afterEachMiddleware(...middleware) {
  pipelines.afterEach.push(...middleware);
}

function Route(route, ...middleware) {
  this.route = route;
  this.queue = middleware; // FIFO
  this.prevIndex = undefined;
  this.context = undefined;

  this.nextErrHandler = function nextErrHandler() {
    for (let i = this.prevIndex + 1; i < this.queue.length; i++) {
      if (this.queue.at(i).length > 2) return i;
    }
    return -1;
  };

  this.runner = async function runner(index, err) {
    this.prevIndex = err ? this.nextErrHandler() : index;
    const middleware = this.queue.at(this.prevIndex /* current index*/);
    if (middleware) {
      await middleware(
        this.context,
        this.runner.bind(this, index + 1 /* next index */),
        err
      );
    }
  };

  this.errorWrapper = async function errorWrapper(index, err) {
    try {
      await this.runner(index, err);
    } catch (err) {
      if (this.prevIndex === -1) {
        // if all error handling middleware have been called including
        // the last default one, return it to the caller
        throw err;
      } else {
        await this.errorWrapper(index, err);
      }
    }
  };

  const exec = async function exec(pipeline, context = {}) {
    this.queue = pipeline.flat(3);
    this.context = {
      req: {
        route: this.route,
        payload: {
          ...context,
        },
      },
      res: {},
    };
    this.prevIndex = -1;

    await this.errorWrapper(0);
    return this.context;
  };

  const skipNone = exec.bind(this, [
    pipelines.beforeAll,
    this.queue.map((handler) => [
      pipelines.beforeEach,
      handler,
      pipelines.afterEach,
    ]),
    pipelines.afterAll,
    lastMiddleware,
  ]);
  skipNone.skipAll = exec.bind(this, [
    this.queue,
    function (context, next, err) {
      if (err) throw err;
    },
  ]);
  return skipNone;
}

export {
  Route,
  clearAll,
  registerGlobalErrorHandler,
  beforeAllMiddleware,
  beforeEachMiddleware,
  afterAllMiddleware,
  afterEachMiddleware,
};
