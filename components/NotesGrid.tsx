'use client'
import React, { useState } from "react";
import SearchBox from "@/components/SearchBox"
import Note from "@/components/Note"

const NotesGrid = ({ notes }: any) => {

    const [filteredNotes, setFilteredNotes] = useState(notes)

    const handleSearchChange = (searchtext: string) => {
        const filtered = notes.filter((note: any) => note.title.toLowerCase().includes(searchtext.toLowerCase()));
        setFilteredNotes(filtered);
        // const filtered = notes.filter((note: any) => {
        //     note.title.toLowerCase().includes(searchtext.toLowerCase());
        //     setFilteredNotes(filtered);
        // })
    }
    return (
        <div>
            <SearchBox onSearchChange={handleSearchChange} />

            <div className="grid gap-3 xs:grid-cols-2 sm:gird-cols-2 md:grid-cols-2 lg:grid-cols-3">
                {filteredNotes.map((note: any) => (
                    <Note note={note} key={note.id} />
                ))}
                {filteredNotes.length === 0 && (
                    <div className="col-span-full text-center items-center justify-center">
                        {"You don't have any notes yet. Why don't you create one?"}
                    </div>
                )}
            </div>
        </div>
    )
}

export default NotesGrid