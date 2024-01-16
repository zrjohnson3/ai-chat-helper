'use client';
import { Note as NoteModel } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useState } from "react";
import AddEditNoteDialog from "./AddEditNoteDialog";

interface NoteProps {
    note: NoteModel
}


export default function Note({ note }: NoteProps) {

    const [showEditDialog, setShowEditDialog] = useState(false);

    const wasUpdated = note.updatedAt > note.createdAt; // Check if note was updated (if updatedAt is greater than createdAt)

    const createdUpdatedAtTimestamp = (
        wasUpdated ? note.updatedAt : note.createdAt
    ).toDateString(); // Get the date string of the timestamps (createdAt or updatedAt)



    // useEffect(() => {
    //     // Check if the note has been updated
    //     if (note.updatedAt > note.createdAt) {
    //         // Show a message indicating that the note has been updated
    //         setShowEditDialog(true);
    //     }
    // }, [note]);


    return (
        <>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setShowEditDialog(true)}>
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
            <AddEditNoteDialog
                open={showEditDialog}
                setOpen={setShowEditDialog}
                noteToEdit={note}
            />
        </>
    )
}