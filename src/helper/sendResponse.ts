import { Response } from "express";

interface SuccessResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
}

interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  error: any;
}

// 🔵 Success function
export function sendSuccess<T = any>(
  res: Response,
  options: {
    data: T;
    message?: string;
    statusCode?: number;
  }
): void {
  const response: SuccessResponse<T> = {
    success: true,
    statusCode: options.statusCode ?? 200,
    message: options.message ?? "OK",
    data: options.data,
  };

  res.status(response.statusCode).json(response);
}

// 🔴 Error function
export function sendError(
  res: Response,
  options: {
    error: any;
    message?: string;
    statusCode?: number;
  }
): void {
  const response: ErrorResponse = {
    success: false,
    statusCode: options.statusCode ?? 500,
    message: options.message ?? "Something went wrong",
    error: options.error,
  };

  res.status(response.statusCode).json(response);
}
