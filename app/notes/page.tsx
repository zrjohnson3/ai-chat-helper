import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs"
import { Metadata } from "next"
import Note from "@/components/Note";

export const metadata: Metadata = {
    title: 'ZapFlow.ai - Notes',
}

export default async function NotesPage() {

    const { userId } = auth(); // Make sure user is logged in
    console.log(userId)

    if (!userId) { throw Error("userId undefined") } // Tell TypeScript that userId is not undefined

    const allNotes = await prisma.note.findMany({ where: { userId } })

    return (
        // <div>
        //     {/* <h1>Here will be your notes Page</h1> */}
        //     <div>{JSON.stringify(allNotes)}</div>
        // </div>

        <div className="grid gap-3 xs:grid-cols-2 sm:gird-cols-2 md:grid-cols-2 lg:grid-cols-3">
            {allNotes.map((note) => (
                <Note note={note} key={note.id} />
            ))}
            {allNotes.length === 0 && (
                <div className="col-span-full text-center items-center justify-center">
                    {"You don't have any notes yet. Why don't you create one?"}
                </div>
            )}
        </div>
    )
}