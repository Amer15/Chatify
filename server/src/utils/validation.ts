import { z } from "zod";
import { CustomError } from "./custom_error";
import { zodErrorMessage } from "./zod";
/**
 * Validates data against a Zod schema and returns the parsed data if valid.
 * @param schema - The Zod schema to validate the data against.
 * @param data - The data to validate.
 * @returns The parsed data, typed according to the schema.
 * @throws CustomError if validation fails, with a 400 status code.
 */
export function validateSchema<T extends z.ZodSchema>(
  schema: T,
  data: unknown
): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new CustomError(zodErrorMessage(result.error), 400);
  }

  // Safe to disable because `schema.safeParse` ensures `result.data` matches `z.infer<T>` when `result.success` is true.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return result.data;
}
