import openai, { getEmbedding } from "@/lib/openai";
import { ChatCompletion, ChatCompletionMessage, ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { auth } from "@clerk/nextjs";
import { notesIndex } from "@/lib/pinecone";
import prisma from "@/lib/db/prisma";
import { OpenAIStream, StreamingTextResponse } from "ai";


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const messages: ChatCompletionMessage[] = body.messages; // Get the messages from the request body in the format of ChatCompletionMessage[]

        // Check if the messages are valid
        if (!messages) {
            return Response.json({ error: "Invalid Input" }, { status: 400 });
        }

        const messagesTruncated = messages.slice(-6); // Get the last 6 messages (chat history)

        const embedding = await getEmbedding(messagesTruncated.map((message) => message.content).join("\n")); // Get the embedding for the messages


        // Example of vector embedding for chat history:
        // Hey, whats my wifi passowrd?
        // ai resonpse: Your wifi password is 12345678
        // Thank you, what is my phone pin?
        // ai response: Your phone pin is 1234
        // Everything becomes a vector embedding and is stored in pinecone

        // Get user id from clerk
        const { userId } = auth();

        const vectorQueryResponse = await notesIndex.query({
            vector: embedding,
            topK: 4, // higher value = more results and more accuate results (more data gets sent to chat GTP (cost more))
            filter: { userId }
        })

        const revelantNotes = await prisma.note.findMany({
            where: {
                id: {
                    in: vectorQueryResponse.matches.map((match) => match.id)
                }
            }
        })

        console.log("Revelant notes found: ", revelantNotes);

        const systemMessage: ChatCompletionMessageParam = {
            role: "system",
            content: "You are an intelligent note-taking app. You answer the user's questions and help them remember things based on their exising notes." +
                "The revelant notes for this query are:\n" +
                revelantNotes.map((note) => `Title: ${note.title}\nContent:\n${note.content}`)
        };

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            stream: true,
            messages: [systemMessage, ...messagesTruncated,],
        });

        const stream = OpenAIStream(response);    // Create a stream from the response
        return new StreamingTextResponse(stream); // Return the response as a stream (streaming text response

    }
    catch (error) {
        console.error(error);
        return Response.json({ error: "Internl Server Error" }, { status: 500 });
    }
}