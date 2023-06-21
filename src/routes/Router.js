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
      console.log(err);
    } else {
      console.log("GLOBAL ERROR HANDLER WAS DEFINED");
      pipelines.globalErrHandler(context, err);
    }
  }
}

function globalErrHandler(context, next, err) {
  console.log("GLOBAL ERR HANDLER");
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

function Router(handler) {
  this.stack = [];
  this.after = [];
  this.before = [];
  this.prevIndex = undefined;
  this.context = undefined;

  this.nextErrHandler = function nextErrHandler() {
    for (let i = this.prevIndex + 1; i < this.stack.length; i++) {
      if (this.stack.at(i).length > 2) return i;
    }
    return -1;
  };

  this.runner = async function runner(index, err) {
    this.prevIndex = err ? this.nextErrHandler() : index;
    const middleware = this.stack.at(this.prevIndex /* current index*/);
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
      console.log("before calling error wrapper");
      await this.errorWrapper(index, err);
    }
  };

  const exec = async function exec(pipeline, context) {
    this.stack = pipeline.flat();
    // this.stack = [
    //   ...pipelines.beforeAll,
    //   ...handlers
    //     .map((handler) => [
    //       ...pipelines.beforeEach,
    //       handler,
    //       ...pipelines.afterEach,
    //     ])
    //     .flat(),
    //   ...pipelines.afterAll,
    //   lastMiddleware,
    // ];
    this.context = {
      req: context,
      res: {},
    };
    this.prevIndex = -1;

    await this.errorWrapper(0);
    return this.context;
  };

  const skipNone = exec.bind(this, [
    pipelines.beforeAll,
    [this.before, handler, this.after].map((handler) => [
      pipelines.beforeEach,
      handler,
      pipelines.afterEach,
    ]),
    pipelines.afterAll,
    lastMiddleware,
  ]);
  skipNone.skipGlobals = exec.bind(this, [
    this.before,
    handler,
    this.after,
    () => {},
  ]);
  skipNone.skipAll = exec.bind(this, [handler, () => {}]);
  skipNone.after = function after(middleware) {
    this.after.push(middleware);
  };
  skipNone.before = function before(middleware) {
    this.before.push(middleware);
  };
  return skipNone;
}

export {
  Router,
  registerGlobalErrorHandler,
  beforeAllMiddleware,
  beforeEachMiddleware,
  afterAllMiddleware,
  afterEachMiddleware,
};
