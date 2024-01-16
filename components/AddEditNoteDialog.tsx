import { CreateNoteSchema, createNoteSchema } from "@/lib/validation/note";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { create } from "domain";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import LoadingButton from "./ui/loading-button";
import { useRouter } from "next/navigation";
import { Note } from "@prisma/client";
import { useState } from "react";

interface AddEditNoteDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    noteToEdit?: Note;
}

export default function AddEditNoteDialog({
    open,
    setOpen,
    noteToEdit,
}: AddEditNoteDialogProps) {

    const [deleteInProgress, setDeleteInProgress] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const router = useRouter();

    const form = useForm<CreateNoteSchema>({
        resolver: zodResolver(createNoteSchema),
        defaultValues: {
            title: noteToEdit?.title || "",
            content: noteToEdit?.content || "",
        }
    });

    async function onSubmit(input: CreateNoteSchema) {
        // alert(JSON.stringify(input));
        try {
            if (noteToEdit) {
                // Update the note
                const response = await fetch("api/notes", {
                    method: "PUT",
                    body: JSON.stringify({
                        id: noteToEdit.id,
                        ...input,
                    }),
                })

                if (!response.ok) throw Error("Status Code: " + response.statusText + " " + response.status)
            }
            else {
                // Create a new note
                const response = await fetch("api/notes", {
                    method: "POST",
                    body: JSON.stringify(input),
                })

                if (!response.ok) throw Error("Status Code: " + response.statusText + " " + response.status);
            }
            form.reset();   // Since we are not using state (its a server component) we need to reset the form manually
            router.refresh(); // Refresh the page to get the new note
            setOpen(false); // Close the dialog
        }
        catch (error: any) {
            console.log(error);
            alert("Something went wrong. Please try again.");
        }

    }

    async function deleteNote() {
        if (!showDeleteConfirmation) {
            setShowDeleteConfirmation(true);
            return;
        }
                if (!noteToEdit) return;
        setDeleteInProgress(true);
        try {
            const response = await fetch("api/notes", {
                method: "DELETE",
                body: JSON.stringify({ id: noteToEdit.id }),
            })
        }
        catch (error) {
            console.log(error);
            alert("Something went wrong. Please try again.");
        }
        finally {
            setDeleteInProgress(false);
        }
        form.reset();   // Since we are not using state (its a server component) we need to reset the form manually
        router.refresh(); // Refresh the page to get the new note
        setOpen(false); // Close the dialog
    }

    function confirmDelete() {
        setShowDeleteConfirmation(true);
    }

    function cancelDelete() {
        setShowDeleteConfirmation(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{noteToEdit ? "Edit Note" : "Add Note"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Note title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Note title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Note title</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Note content" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="gap-1 sm:gap-0">
                            {noteToEdit && (
                                <LoadingButton
                                    variant="destructive"
                                    loading={deleteInProgress}
                                    disabled={form.formState.isSubmitting}
                                    onClick={deleteNote}
                                    type="button"
                                >
                                    Delete Note
                                </LoadingButton>
                            )}
                            <LoadingButton type="submit" loading={form.formState.isSubmitting}>
                                Submit
                            </LoadingButton>
                        </DialogFooter>
                        {showDeleteConfirmation && (
                            <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Delete Note</DialogTitle>
                                    </DialogHeader>
                                    <p>Are you sure you want to delete this note?</p>
                                    <DialogFooter className="gap-1 sm:gap-0">
                                        <LoadingButton
                                            variant="destructive"
                                            loading={deleteInProgress}
                                            disabled={form.formState.isSubmitting}
                                            onClick={deleteNote}
                                            type="button"
                                        >
                                            Delete Note
                                        </LoadingButton>
                                        <LoadingButton type="submit" loading={form.formState.isSubmitting}>
                                            Submit
                                        </LoadingButton>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                    </form>

                </Form>
            </DialogContent>
        </Dialog>
    )
}