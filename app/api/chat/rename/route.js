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

        const { chatId, name } = await request.json();

        await ChatModel.findOneAndUpdate({ _id: chatId, userId }, { name });

        return NextResponse.json(
            {
                success: true,
                message: "Chat Renamed"
            }
        );
    } catch (Error) {

        return NextResponse.json(
            {
                success: false,
                message: "Error: Chat Renaming Failed. Exception: ${Error}"
            }
        );
    }
}