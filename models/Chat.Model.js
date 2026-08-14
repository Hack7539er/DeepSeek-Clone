import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
    {
        name: { type: String, required: true} ,
        messages: [
            {
                role: { type: String, required: true },
                content: { type: String, required: true },
                timestamp: { type: Number, required: true}
            }
        ],
        userId: { type: String, required: true }
    },
    { timestamps: true }
);


const ChatModel = mongoose.models.chats || mongoose.model("user", ChatSchema);

export default ChatModel;