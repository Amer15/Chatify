import z from "zod";

export const signupSchema = z.object({
  fullName: z.string().min(4).max(24),
  email: z.string().email(),
  password: z.string().min(6).max(20),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(20),
});

export const updateProfileSchema = z.object({
  profile_image: z.custom<Express.Multer.File>(
    (file) => {
      return (
        file &&
        typeof file === "object" &&
        "mimetype" in file &&
        ["image/png", "image/jpg", "image/jpeg", "image/webp"].includes(
          file.mimetype
        )
      );
    },
    {
      message: "invalid file type, only JPG, JPEG, PNG or WEBP formats allowed",
    }
  ),
});
