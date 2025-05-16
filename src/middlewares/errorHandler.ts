import { Request, Response, NextFunction } from "express";

export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
export const errorHandler = (
  err: ApiError | Error,

  req: Request,

  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).send({
      message: err.message,
      statusCode: err.statusCode,
      status: "FAILED",
    });
  } else {
    return res.status(500).send({
      message: "Internal Error",
    });
  }
};
