import { Webhook } from "svix";
import connectToDatabase from "@/lib/Database";
import UserModel from "@/models/User.Model";
import Configs from "@/config/Configs";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request) {
    const wh = new Webhook(Configs.getClerkSigninSecretKey());
    const headerPayload = await headers();
    const svixHeaders = {
        "svix-id": headerPayload.get("svix-id"),
        "svic-signature": headerPayload.get("svix-signature"),
    };

    const payload = await request.json();
    const body = JSON.stringify(payload);
    const { data, type } = wh.verify(body, svixHeaders);

    const userData = {
        _id: data.id,
        name: `${data.first_name} ${data.last_name}`,
        email: data.email_addresses[0].email_address,
        image: data.image_url,
    };

    await connectToDatabase();

    switch (type) {
        case "user.created":
            await User.create(userData);
            break;
        case "user.updated":
            await User.findByIdAndUpdate(data.id, userData);
            break;
        case "user.deleted":
            await User.findByIdAndDelete(data.id);
            break;
        default:
            break;
    }

    return NextRequest.json({
        message: "Event Received",
    });
}
