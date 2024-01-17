import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.PINECONE_API_KEY;

if (!apiKey) {
    throw Error("No Pinecone API Key");
}

const pinecone = new Pinecone({
    environment: "gcp-starter",
    apiKey,

});

export const notesIndex = pinecone.Index("ai-chat-helper")