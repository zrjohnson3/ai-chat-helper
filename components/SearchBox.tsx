'use client'
import React, { useState } from "react"
import { Input } from "./ui/input"
import { Button } from "@/components/ui/button";
import { Label } from "./ui/label"
import { PiMagnifyingGlassPlusBold } from "react-icons/pi";

const SearchBox = ({ onSearchChange }: { onSearchChange: (searchText: string) => void }) => {

    const [searchText, setSearchText] = useState("");


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const text = event.target.value;
        setSearchText(text);
        onSearchChange(text); // Call the onSearchChange prop in callback function
    }


    return (
        <div className="flex space-x-2 flex-col-3 py-4 mx-10 items-center" >
            <Label className="whitespace-nowrap m-4" >Find Notes: </Label>
            <Input
                type={"search"}
                value={searchText}
                autoComplete="on"
                placeholder="Search for recent notes"
                onChange={handleChange}
            />
            <Button
                type="submit"
                className=""
            >Search</Button>

        </div>
    )

}

export default SearchBox;