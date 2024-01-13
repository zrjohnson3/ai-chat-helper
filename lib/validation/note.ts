import { z } from "zod"

export const createNoteSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }).max(255, { message: "Title is can not be over 255 characters" }),
    content: z.string().min(1).optional()
});


export type CreateNoteSchema = z.infer<typeof createNoteSchema>;