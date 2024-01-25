import { cn } from '@/lib/utils';
import { useChat } from 'ai/react';
import { Bot, Trash, XCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Message } from 'ai';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

interface AIChatBoxProps {
    open: boolean;
    onClose: () => void;
}

export default function AIChatBox({ open, onClose }: AIChatBoxProps) {

    // Use the useChat hook to get the messages, input, handleInputChange, handleSubmit, setMessages, isLoading, and error variables
    // These are the variables that we need to use to create the chat box and its functionality (there are more you could use)
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        setMessages,
        isLoading,
        error,
    } = useChat(); // By default it sends request to /api/chat 

    const inputRef = useRef<HTMLInputElement>(null); // Create a ref to the input element so we can focus it when the chat box opens
    const scrollRef = useRef<HTMLDivElement>(null);  // Create a ref to the div that contains the messages so we can scroll to the bottom when a new message is added

    // Will execute when messages changes
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight; // Scroll to the bottom of the messages
        }

    }, [messages])

    useEffect(() => {
        if (open) {
            inputRef.current?.focus(); // Focus the input when the chat box opens
        }
    }, [open])

    const lastMessagIsUser = messages[messages.length - 1]?.role === "user"; // Check if the last message is from the user

    // cn is a utility function that we created to make it easier to conditionally join tailwind class names together and override them
    return <div className={cn('bottom-0 right-0 z-10 w-full max-w-[500px] max-h-800 p-1 xl:right-36', open ? "fixed" : "hidden")}>
        <button onClick={onClose} className='mb-1 ms-auto block'>
            <XCircle size={30} className="mr-2" />
        </button>
        <div className='flex flex-col rounded bg-background border shadow-xl p-1 ' style={{ maxHeight: '80vh' }}>
            <div className='h-full mt-3 px-3 overflow-y-auto' ref={scrollRef}>{messages.map((message) => (
                <ChatMessage message={message} key={message.id} />
            ))}</div>
            {isLoading && lastMessagIsUser && (
                <ChatMessage
                    message={{
                        role: 'assistant',
                        content: "Thinking...",

                    }}
                />
            )}
            {error && (
                <ChatMessage
                    message={{
                        role: 'assistant',
                        content: "Something went wrong. Please try again."
                    }}
                />
            )}
            {!error && messages.length === 0 && (
                <div className='flex h-full items-center justify-center gap-3'>
                    {/* <Bot size={40} /> */}
                    <ChatMessage
                        message={{
                            role: 'assistant',
                            content: "Hello! I'm ZapFlow's AI assistant. Ask me anything about your notes."
                        }}
                    />
                </div>
            )}
            <form onSubmit={handleSubmit} className='m-3 flex gap-2'>
                <Button
                    title='Clear Chat?'
                    variant={'outline'}
                    size={'icon'}
                    type='button'
                    className='shrink-0'
                    onClick={() => setMessages([])}
                >
                    <Trash size={20} />
                </Button>
                <Input
                    value={input}
                    onChange={handleInputChange}
                    ref={inputRef}
                    placeholder='Say something...'
                />
                <Button type='submit'>Send</Button>
            </form>
        </div>
    </div>

}


function ChatMessage({ message: { role, content } }: { message: Pick<Message, "role" | "content"> }) {

    const { user } = useUser(); // Get the user from the useUser hook from Clerk

    const isAiMessage = role === "assistant"; // Check if the message is from the AI

    return (
        <div className={cn('mb-3 flex items-center', isAiMessage ? "justify-start me-5" : "justify-end ms-5")}>

            {isAiMessage && <Bot className='mr-2 shrink-0' />} {/* If the message is from the AI, show the bot icon */}
            <p className={cn('whitespace-pre-line rounded-md border px-3 py-2',
                isAiMessage ? "bg-background" : "bg-primary text-primary-foreground")}>
                {content} {/* Show the message content */}
            </p>
            {!isAiMessage && user?.imageUrl && (
                <Image
                    src={user.imageUrl}
                    width={40}
                    height={40}
                    className='ml-2 rounded-full w-10 h-10 object-cover'
                    alt='User profile picture'
                />
            )}

            {/* <div>{role}</div>
            <div>{content}</div> */}
        </div>
    )
}