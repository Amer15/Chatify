import { z, ZodError } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(5000),
  DB_URL: z.string(),
  JWT_SECRET_KEY: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  TOKEN_LIFE: z.string(),
  REFRESH_TOKEN_LIFE: z.string(),
  CLOUDINARY_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
});

type Env = z.infer<typeof EnvSchema>;
let env: Env;

try {
  env = EnvSchema.parse(process.env);
} catch (e) {
  const error = e as ZodError;
  console.error("Invalid env file");
  console.error(error.flatten().fieldErrors);
  process.exit(1);
}

export default env;
