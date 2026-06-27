import { Request, Response, NextFunction } from 'express';

/**
 * Global error handler middleware.
 * Catches unhandled errors and returns a consistent JSON shape.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Unhandled error:', err.message);
  console.error(err.stack);

  const statusCode = (err as any).statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;

  res.status(statusCode).json({
    error: message,
    statusCode,
  });
}
