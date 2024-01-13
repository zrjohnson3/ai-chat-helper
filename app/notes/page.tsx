import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs"
import { Metadata } from "next"
import { Note } from ".prisma/client"

export const metadata: Metadata = {
    title: 'ZapFlow.ai - Notes',
}

export default async function NotesPage() {

    const { userId } = auth(); // Make sure user is logged in
    console.log(userId)

    if (!userId) { throw Error("userId undefined") } // Tell TypeScript that userId is not undefined

    const allNotes = await prisma.note.findMany({ where: { userId } })

    return (
        <div>
            {/* <h1>Here will be your notes Page</h1> */}
            <div>{JSON.stringify(allNotes)}</div>
        </div>
    )
}