const stacks = {
  beforeAll: [],
  beforeEach: [],
  afterAll: [],
  afterEach: [],
};

function globalErrHandler(context, next, err) {
  console.log("GLOBAL ERR HANDLER");
}

function beforeAllMiddleware(...middleware) {
  stacks.beforeAll.push(...middleware);
}

function beforeEachMiddleware(...middleware) {
  stacks.beforeEach.push(...middleware);
}

function afterAllMiddleware(...middleware) {
  stacks.afterAll.push(...middleware);
}

function afterEachMiddleware(...middleware) {
  stacks.afterEach.push(...middleware);
}

function Router(...handlers) {
  this.stack = [];
  this.prevIndex = undefined;
  this.context = undefined;

  this.nextErrHandler = function nextErrHandler() {
    for (let i = this.prevIndex + 1; i < this.stack.length; i++) {
      if (this.stack.at(i).length > 2) return i;
    }
    return -1;
  };

  /*
    TODO THERE is a risk of infinite loop in the error case.
    The conditions for the case are:
    - prevIndex = -1 (global error handler)
    If an unhandled error or thrown error escapes the global error handler
    it shall be caught by exec() and funneled back to the runner, at which
    point the runner shall execute the global event handler this time, this time with a
    different error object.
   */
  this.runner = async function runner(index, err) {
    const middleware = this.stack.at(err ? this.nextErrHandler() : index);
    this.prevIndex = index;
    if (middleware) {
      await middleware(this.context, this.runner.bind(this, index + 1), err);
    }
  };

  const exec = async function exec(context) {
    this.stack = [
      ...stacks.beforeAll,
      ...handlers
        .map((handler) => [...stacks.beforeEach, handler, ...stacks.afterEach])
        .flat(),
      ...stacks.afterAll,
      globalErrHandler,
    ];
    this.context = context;
    this.prevIndex = -1;

    try {
      await this.runner(0);
    } catch (err) {
      await this.runner(this.nextErrHandler(), err);
    }
  };
  return exec.bind(this);
}

export {
  Router,
  beforeAllMiddleware,
  beforeEachMiddleware,
  afterAllMiddleware,
  afterEachMiddleware,
};
