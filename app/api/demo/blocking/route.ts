import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateText } from "ai"

const google = createGoogleGenerativeAI({
    apiKey: "AIzaSyBRNcc6mQFTZeLyd9oVKLus8kTNeXyYpZQ",
})

export const POST = async () => {
    const response = await generateText({
        model: google('gemini-2.5-flash'),
        prompt: 'Write a vegetarian lasagna recipe for 4 people.',
    })

    return Response.json({ response: response })
}