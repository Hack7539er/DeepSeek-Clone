import Configs from "@/config/Configs";
import connectToDatabase from "@/lib/Database";
import ChatModel from "@/models/Chat.Model";
import { getAuth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import { NextResponse } from "next/server";

export const maxDuration = 60;

/* ============================================================
   GEMINI — DEFAULT
   ============================================================ */

const ai = new GoogleGenAI({
    apiKey: Configs.getAIProvider(),
});

/* ============================================================
   OPENAI — OPTIONAL
   Uncomment this and the OpenAI code below if you want to use
   OpenAI instead of Gemini.
   ============================================================ */

// const openai = new OpenAI({
//     apiKey: Configs.getOpenAIAPIKey(),
// });


/* ============================================================
   DEEPSEEK — OPTIONAL
   DeepSeek provides an OpenAI-compatible API.
   Uncomment this and the DeepSeek code below if you want to use
   DeepSeek instead of Gemini.
   ============================================================ */

// const deepseek = new OpenAI({
//     apiKey: Configs.getDeepSeekAPIKey(),
//     baseURL: "https://api.deepseek.com",
// });


export async function POST(request) {
    try {
        const { userId } = getAuth();

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User Not Authenticated",
                },
                { status: 401 },
            );
        }

        const { chatId, prompt } = await request.json();

        if (!chatId || !prompt) {
            return NextResponse.json(
                {
                    success: false,
                    message: "chatId and prompt are required",
                },
                { status: 400 },
            );
        }

        await connectToDatabase();

        const data = await ChatModel.findOne({
            userId,
            _id: chatId,
        });

        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Chat not found",
                },
                { status: 404 },
            );
        }

        // User message
        const userMessage = {
            role: "user",
            content: prompt,
            timestamp: Date.now(),
        };

        data.messages.push(userMessage);


        /* ========================================================
           GEMINI — DEFAULT
           ======================================================== */

        const interaction = await ai.interactions.create({
            model: "gemini-3.6-flash",
            input: prompt,
            store: true,
        });

        const message = {
            role: "model",
            content: interaction.output_text,
            timestamp: Date.now(),
        };


        /* ========================================================
           OPENAI — OPTIONAL
           
           Uncomment this block if you want to use OpenAI.
           ======================================================== */

        /*
        const response = await openai.responses.create({
            model: "gpt-5.5",
            input: prompt,
        });

        const message = {
            role: "assistant",
            content: response.output_text,
            timestamp: Date.now(),
        };
        */


        /* ========================================================
           DEEPSEEK — OPTIONAL
           
           Uncomment this block if you want to use DeepSeek.
           ======================================================== */

        /*
        const response = await deepseek.chat.completions.create({
            model: "deepseek-v4-pro",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const message = {
            role: "assistant",
            content: response.choices[0].message.content,
            timestamp: Date.now(),
        };
        */


        // AI message
        data.messages.push(message);

        await data.save();

        return NextResponse.json({
            success: true,
            data: message,
        });

    } catch (error) {
        console.error("AI API Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Response Generate Failed",
                error:
                    error instanceof Error
                        ? error.message
                        : String(error),
            },
            { status: 500 },
        );
    }
}