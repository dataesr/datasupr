import HTTPError from "./http.error.js";

class ForbiddenError extends HTTPError {
  constructor(message, errors = []) {
    super(message || "Forbidden", errors);
    this.statusCode = 403;
  }
}

export default ForbiddenError;
