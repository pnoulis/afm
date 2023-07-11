class AsyncActionError extends Error {
  constructor(message) {
    super(message);
    this.name = "AsyncActionError";
  }
}

class ERR_AA_RESET_PENDING extends AsyncActionError {
  constructor() {
    super("trying to reset() a Pending AsyncAction");
    this.code = 1;
  }
}

class ERR_AA_FIRE_SETTLED extends AsyncActionError {
  constructor() {
    super("trying to fire() a Rejected or Resolved AsyncAction");
    this.code = 2;
  }
}

export { ERR_AA_RESET_PENDING, ERR_AA_FIRE_SETTLED };
