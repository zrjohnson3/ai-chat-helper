import { Note as NoteModel } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface NoteProps {
    note: NoteModel
}


export default function Note({ note }: NoteProps) {
    const wasUpdated = note.updatedAt > note.createdAt; // Check if note was updated (if updatedAt is greater than createdAt)

    const createdUpdatedAtTimestamp = (
        wasUpdated ? note.updatedAt : note.createdAt
    ).toDateString(); // Get the date string of the timestamps (createdAt or updatedAt)

    return (
        <Card className="pl-2">
            <CardHeader className="grid grid-cols-2">
                <CardTitle>{note.title}</CardTitle>
                <CardDescription>
                    Last Modified: {createdUpdatedAtTimestamp}
                    {wasUpdated && " (updated)"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="whitespace-pre-line">
                    {note.content}
                </p>
            </CardContent>
            {/* <CardDescription>Last Modified: {createdUpdatedAtTimestamp}</CardDescription> */}
        </Card>
    )
}