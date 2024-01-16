import Image from 'next/image'
import logo from './assets/zapFlow-logo2.5.png'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default function Home() {

  /* Redirect to Notes page if logged in */
  // const { userId } = auth();

  // if (userId) {
  //   redirect('/notes')
  // }

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-5 p-24">
      <div className='flex items-center gap-4'>
        <Image src={logo} alt='ZapFlow Logo' width={100} height={100} className='logo' />
        <span className='font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl'>ZapFlow</span>
      </div>
      <p className='max-w-prose text-center'>
        An intelligent note-tracking app with AI intergration, built with OpenAI, Pinecone, Next.js, Shadcn UI, Clerk, and more.
      </p>
      <Button size={"lg"} asChild>
        <Link href="/notes">Open ZapFlow</Link>
      </Button>
    </main>
  )
}
