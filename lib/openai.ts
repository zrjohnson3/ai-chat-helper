import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;
console.log(apiKey);

if (!apiKey) {
    console.log(apiKey);
    throw Error("No OpenAI API Key");
}

const openai = new OpenAI({ apiKey });

export default openai;


export async function getEmbedding(text: string) {
    const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text,
    })

    const embedding = response.data[0].embedding; // Get the embedding from the response (it's an array of numbers)

    if (!embedding) {
        throw Error("No embedding - Error generating embedding");
    }

    console.log(embedding);

    return embedding;
}