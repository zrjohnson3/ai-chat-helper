import prisma from "@/lib/db/prisma";
import { createNoteSchema } from "@/lib/validation/note";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {

    try {
        const reqBody = await req.json();

        const parseResult = createNoteSchema.safeParse(reqBody);

        if (!parseResult.success) {
            console.log(parseResult.error);
            return Response.json({ error: "Invalid Input: " + parseResult.error.message })
        }

        const { title, content } = parseResult.data;

        const { userId } = auth();

        if (!userId) {
            return Response.json({ error: "Unauthorized" })
        }

        const note = await prisma.note.create({
            data: {
                title,
                content,
                userId,
            }
        })

        return Response.json({ note }, { status: 201 }) //Return back to frontend

    }
    catch (err) {
        console.log(err)
        return Response.json({ error: "Internal Server Error" })
    }
}