import connectToDatabase from "@/lib/Database";
import ChatModel from "@/models/Chat.Model";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {

    try {

        const { userId } = getAuth(request);

        if (!userId) return NextResponse.json(
            {
                success: false,
                message: "User Not Authenticated"
            }
        );

        await connectToDatabase();

        const data = await ChatModel.find({ userId });

        return NextResponse.json(
            {
                success: true,
                data
            }
        );
    } catch (Error) {

        return NextResponse.json(
            {
                success: false,
                message: `Error: Chat Find Failed. Exception: ${Error}`
            }
        );
    }
}