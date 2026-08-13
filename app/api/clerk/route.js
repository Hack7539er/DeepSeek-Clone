import { Webhook } from "svix";
import connectToDatabase from "@/lib/Database";
import UserModel from "@/models/User.Model";
import Configs from "@/config/Configs";
import { headers } from "next/headers";

export async function POST(request) {

    console.log("Start POST Request")
    try {
        const wh = new Webhook(Configs.getClerkSigninSecretKey());

        const headerPayload = await headers();

        const svixHeaders = {
            "svix-id": headerPayload.get("svix-id"),
            "svix-timestamp": headerPayload.get("svix-timestamp"),
            "svix-signature": headerPayload.get("svix-signature"),
        };

        // IMPORTANT: Get raw body for Svix verification
        const body = await request.text();

        const { data, type } = wh.verify(body, svixHeaders);

        const userData = {
            _id: data.id,
            name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            email: data.email_addresses?.[0]?.email_address,
            image: data.image_url,
        };

        await connectToDatabase();

        switch (type) {
            case "user.created":
                await UserModel.create(userData);
                break;

            case "user.updated":
                await UserModel.findByIdAndUpdate(data.id, userData);
                break;

            case "user.deleted":
                await UserModel.findByIdAndDelete(data.id);
                break;

            default:
                break;
        }

        return Response.json({
            message: "Event Received",
        });
    } catch (error) {
        console.error("Clerk webhook error:", error);

        return Response.json(
            {
                message: "Webhook verification failed",
            },
            {
                status: 400,
            }
        );
    }
}
