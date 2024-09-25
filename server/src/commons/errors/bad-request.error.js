import HTTPError from "./http.error.js";

class BadRequestError extends HTTPError {
  constructor(message, errors = []) {
    super(message || "Bad request", errors);
    this.statusCode = 400;
  }
}

export default BadRequestError;
