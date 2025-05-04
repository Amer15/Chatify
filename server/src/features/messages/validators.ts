import z from "zod";

export const sendMessageSchema = z.object({
  receiverId: z.string().regex(/^[0-9a-fA-F]{24}$/, "invalid receiver_id"),
  message: z.string().min(1).max(1000).nullable(),
  image: z
    .custom<Express.Multer.File | null>(
      (file) => {
        if(file === null) return true;
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
        message:
          "invalid file type, only JPG, JPEG, PNG or WEBP formats allowed",
      }
    )
    .optional(),
});
