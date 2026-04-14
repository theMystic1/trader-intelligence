import { NextResponse } from "next/server";

/* =========================================================
   BASE ERROR CLASS
========================================================= */

export class BaseError extends Error {
  statusCode: number;
  code?: string;
  details?: any;
  isOperational: boolean;

  constructor(message: string, statusCode = 500, code?: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/* =========================================================
   MONGOOSE ERROR CLASSES
========================================================= */

export class DuplicateKeyError extends BaseError {
  constructor(field: string, value: any) {
    super(`${field} already exists`, 409, "DUPLICATE_KEY", { field, value });
  }
}

export class ValidationError extends BaseError {
  constructor(errors: any[]) {
    super("Validation failed", 400, "VALIDATION_ERROR", errors);
  }
}

export class CastError extends BaseError {
  constructor(field: string, value: any) {
    super(`Invalid ${field}: ${value}`, 400, "CAST_ERROR", { field, value });
  }
}

export class NotFoundError extends BaseError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, "NOT_FOUND");
  }
}

/* =========================================================
   ERROR TRANSLATOR (MONGOOSE → CUSTOM ERRORS)
========================================================= */

export const handleMongooseError = (error: any): BaseError => {
  // 🔴 Duplicate Key Error (E11000)
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    const value = error.keyValue[field];

    return new DuplicateKeyError(field, value);
  }

  // 🔴 Validation Error
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((el: any) => ({
      field: el.path,
      message: el.message,
    }));

    return new ValidationError(errors);
  }

  // 🔴 Cast Error (invalid ObjectId, etc.)
  if (error.name === "CastError") {
    return new CastError(error.path, error.value);
  }

  // 🔴 Already Custom Error
  if (error instanceof BaseError) {
    return error;
  }

  // 🔴 Fallback
  return new BaseError("Internal Server Error", 500, "INTERNAL_ERROR");
};

/* =========================================================
   RESPONSE FORMATTER
========================================================= */

export const errorResponse = (error: BaseError) => {
  return NextResponse.json(
    {
      status: "error",
      message: error.message,
      code: error.code,
      details: error.details || null,
    },
    { status: error.statusCode },
  );
};
