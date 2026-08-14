import Configs from "@/config/Configs";
import connectToDatabase from "@/lib/Database";
import ChatModel from "@/models/Chat.Model";
import { getAuth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export const maxDuration = 60;

const ai = new GoogleGenAI({
    apiKey: Configs.getDeepSeekAPIKey(),
});

export async function POST(request) {
    try {
        const { userId } = getAuth(request);

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

        // Gemini
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

        // AI message
        data.messages.push(message);

        await data.save();

        return NextResponse.json({
            success: true,
            data: message,
        });
    } catch (error) {
        console.error("Gemini API Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Response Generate Failed",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 },
        );
    }
}
