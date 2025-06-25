import { Response } from "express";

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function returnErrorMessage(err: unknown, res: Response) {
  if (err instanceof Error) {
    res.status(500).json({ error: err.message });
  } else {
    // If err is not an Error instance, convert it to string
    res.status(500).json({ error: String(err) });
  }
}
