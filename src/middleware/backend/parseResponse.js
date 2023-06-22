import * as Errors from "../errors.js";

function parseResponse(res) {
  if (res.result === "NOK") {
    if (res.validationErrors) {
      throw new Errors.ValidationError(res.validationErrors);
    } else {
      throw new Errors.ModelError(res);
    }
  }
  return res;
}

export { parseResponse };
