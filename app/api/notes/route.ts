import prisma from "@/lib/db/prisma";
import { createNoteSchema, deleteNoteSchema, updateNoteSchema } from "@/lib/validation/note";
import { auth } from "@clerk/nextjs";


// Create a note
export async function POST(req: Request) {

    try {
        // Get the request body
        const reqBody = await req.json();

        // Validate the request body
        const parseResult = createNoteSchema.safeParse(reqBody);

        // Check if the request body is valid
        if (!parseResult.success) {
            console.log(parseResult.error);
            return Response.json({ error: "Invalid Input: " + parseResult.error.message })
        }

        // Get the title and content from the request body
        const { title, content } = parseResult.data;

        // Get the user id from clerk
        const { userId } = auth();

        // Check if user is logged in
        if (!userId) {
            return Response.json({ error: "Unauthorized" })
        }

        // Create the note
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


// Update a note
// We could use patch, but since we are already reloading the page/data, we can just use put
export async function PUT(req: Request) {
    try {
        const body = await req.json(); // Get the body of the request

        // Validate the request body
        const parseResult = updateNoteSchema.safeParse(body);

        // Check if the request body is valid
        if (!parseResult.success) {
            console.log(parseResult.error);
            return Response.json({ error: "Invalid Input: " + parseResult.error.message })
        }

        // Get the title and content from the request body
        const { id, title, content } = parseResult.data;

        const note = await prisma.note.findUnique({ where: { id } })

        if (!note) {
            return Response.json({ error: "Note not found" }, { status: 404 })
        }

        // Get the user id from clerk
        const { userId } = auth();

        // Check if user is logged in
        if (!userId || userId !== note.userId) {
            return Response.json({ error: "Unauthorized" })
        }

        const updateNote = await prisma.note.update({
            where: { id },
            data: {
                title,
                content,
            }
        })

        return Response.json({ updateNote }, { status: 200 }) // Return back to frontend with success status
    }
    catch (error) {
        console.log(error)
        return Response.json({ error: "Internal Server Error" })
    }


}


// // Delete a note
// // We could use patch, but since we are already reloading the page/data, we can just use put
export async function DELETE(req: Request) {
    try {
        const body = await req.json(); // Get the body of the request

        // Validate the request body
        const parseResult = deleteNoteSchema.safeParse(body);

        // Check if the request body is valid
        if (!parseResult.success) {
            console.log(parseResult.error);
            return Response.json({ error: "Invalid Input: " + parseResult.error.message })
        }

        // Get the title and content from the request body
        const { id } = parseResult.data;

        const note = await prisma.note.findUnique({ where: { id } })

        if (!note) {
            return Response.json({ error: "Note not found" }, { status: 404 })
        }

        // Get the user id from clerk
        const { userId } = auth();

        // Check if user is logged in
        if (!userId || userId !== note.userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }

        await prisma.note.delete({
            where: { id }
        })

        return Response.json({ message: "Note deleted" }, { status: 200 }) // Return back to frontend with success status
    }
    catch (error) {
        console.log(error)
        return Response.json({ error: "Internal Server Error" })
    }


}