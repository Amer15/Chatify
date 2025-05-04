// src/types/express.d.ts
export {};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user_id?: string;
      employee_id?: string;
      employee_role?: string;
    }
  }
}
