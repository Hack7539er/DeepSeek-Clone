import connectToDatabase from "@/lib/Database";
import ChatModel from "@/models/Chat.Model";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {

    try {

        const { userId } = getAuth(request);

        if (!userId) return NextResponse.json(
            {
                success: false,
                message: "User Not Authenticated"
            }
        );

        const chatData = {
            userId,
            messages: [],
            name: "New Chat"
        };

        await connectToDatabase();

        await ChatModel.create(chatData);

        return NextResponse.json(
            {
                success: true,
                message: "Chat Created"
            }
        );
         
    } catch (Error) {

        return NextResponse.json(
            {
                success: false,
                message: `Error: Chat Creation Failed. Exception:${Error}`
            }
        );
    }
}