'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import logo from "../assets/zapFlow-logo2.5.png"
import { UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import AddNoteDialog from '../../components/AddEditNoteDialog'

const NavBar = () => {

    const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false)

    return (
        <>
            <div className='p-4 shadow'>
                <div className='flex flex-wrap gap-3 items-center justify-between max-w-7xl m-auto'>
                    <Link href={'/'} className='flex items-center gap-1'>
                        <Image src={logo} alt='logo' width={80} height={80} />
                        <span>ZapFlow</span>
                    </Link>
                    <div className='flex gap-4 items-center'>
                        <Button onClick={() => setShowAddEditNoteDialog(true)}>
                            <Plus size={20} className="mr-2" />
                            Add Note
                        </Button>

                        <UserButton afterSignOutUrl='/'
                            appearance={{
                                elements: {
                                    avatarBox: { width: "2.5rem", height: "2.5rem", borderRadius: "50%" },
                                }
                            }
                            }
                        />


                    </div>
                </div>
            </div>
            <AddNoteDialog open={showAddEditNoteDialog} setOpen={setShowAddEditNoteDialog} />
        </>
    )
}

export default NavBar