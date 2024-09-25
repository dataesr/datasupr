import HTTPError from "./http.error.js";

class ServerError extends HTTPError {
  constructor(message, errors = []) {
    super(message || "Server error", errors);
    this.statusCode = 500;
  }
}

export default ServerError;
