import { generateText } from "ai";
import { inngest } from "./client";
import { google } from "@ai-sdk/google";
import { firecrawl } from "@/lib/firecrawl";

export const background = inngest.createFunction(
    { id: "background" },
    { event: "background/google-ai" },
    async ({ event, step }) => {
        // Parse the input for any URLS (Step)
        const urls = await step.run("extract-urls", async () => {
            const URLRegex = /\b(?:https?:\/\/|www\.)[^\s]+/g
            return event.data.prompt.match(URLRegex) || []
        })

        // Scrape the URLs content via Firecrawl (Step)
        const scrapedContent = await step.run("scrape-urls", async () => {
            const content = await Promise.all(
                urls.map(
                    async (url: string) => {
                        const result = await firecrawl.scrape(url, { formats: ["markdown"] })
                        return result.markdown
                    }

                )
            )

            // Boolean("") -> false
            // Boolean ("content") --> true
            // Thus when used with filter, it filters out the empty strings
            return content.filter(Boolean).join("\n\n")
        })

        // Send the content with "context:scrapped-content /n/n question: [question]"
        return await step.run(
            "generate-answer",
            async () => {
                return await generateText({
                    model: google('gemini-2.5-flash'),
                    prompt: `context: ${scrapedContent} \n\n prompt:${event.data.prompt}`
                })
            }
        )
    },
);