import { z, ZodError } from "zod";
/**
 * Formats a Zod validation error into a readable error message.
 * @param error - The `ZodError` object containing validation issues.
 * @returns A formatted string summarizing all validation issues.
 *
 * - Each issue is represented as: `path: message - code`.
 * - Paths are joined with a dot notation; if the path is unavailable, "unknown-path" is used.
 * - Issues are separated by commas in the resulting string.
 */
export function zodErrorMessage(error: ZodError): string {
  return error.issues
    .map(
      (issue) =>
        `${issue.path.join(".") || "unknown-path"}: ${issue.message} - ${
          issue.code
        }`
    )
    .join(", ");
}

export const arrayOfIdsSchema = z
  .object({
    ids: z.array(z.number()).min(1),
  })
  .strict();
