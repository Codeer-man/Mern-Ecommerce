export class ErrorHandler extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public success: boolean // public isOperational: boolean
  ) {
    super(message);
    this.statusCode = statusCode || 500;
    this.success = success;
    // this.isOperational = isOperational;

    // Maintain proper prototype chain
    Object.setPrototypeOf(this, ErrorHandler.prototype);

    // Capture stack trace (excluding constructor call)
    Error.captureStackTrace(this, this.constructor);
  }
}
