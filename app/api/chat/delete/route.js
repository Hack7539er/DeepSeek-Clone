import connectToDatabase from "@/lib/Database";
import ChatModel from "@/models/Chat.Model";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    
    try {

        const { userId } = getAuth(request);
        const { chatId } = await request.json();

        if (!userId) return NextResponse.json(
            {
                success: false,
                message: "User Not Authenticated"
            }
        );

        else if (!chatId) return NextResponse.json(
            {
                success: false,
                message: "Error: Chat Not Found"
            }
        );

        await connectToDatabase();

        await ChatModel.deleteOne({_id: chatId, userId });

        return NextResponse.json(
            {
                success: true,
                message: "Chat Deleted Successfully"
            }
        );

        
    } catch (Error) {

        return NextResponse.json(
            {
                success: false,
                message: "Error: Chat Deleting Failed. Exception: ${Error}"
            }
        );
    }
}