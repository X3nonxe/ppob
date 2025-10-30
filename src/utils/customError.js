class ServiceNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ServiceNotFoundError';
    this.statusCode = 404;
  }
}

class InsufficientBalanceError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InsufficientBalanceError';
    this.statusCode = 400;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

module.exports = {
  ServiceNotFoundError,
  InsufficientBalanceError,
  ValidationError,
	ServerError
};
