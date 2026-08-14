"use client";

import Image from "next/image";
import { assets } from "@/assets/assets";
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

const PromptBox = ({ loading, setIsLoading }) => {
    const [prompt, setPrompt] = useState("");

    const { user, setChats, selectedChats, setSelectedChats } = useAppContext();

    const keyDownHandler = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();

            if (!loading) {
                sendPromptHandler(event);
            }
        }
    };

    const sendPromptHandler = async (event) => {
        event?.preventDefault();

        const promptCopy = prompt.trim();

        if (!promptCopy) return;

        if (!user) {
            toast.error("Login To Send Message");
            return;
        }

        if (!selectedChats?._id) {
            toast.error("Please select a chat");
            return;
        }

        if (loading) {
            toast.error("Wait For The Previous Prompt Response");
            return;
        }

        setIsLoading(true);
        setPrompt("");

        const chatId = selectedChats._id;

        const userPrompt = {
            role: "user",
            content: promptCopy,
            timestamp: Date.now(),
        };

        // --------------------------------
        // Add user message to selected chat
        // --------------------------------

        setChats((previousChats) => {
            if (!Array.isArray(previousChats)) {
                return previousChats;
            }

            return previousChats.map((chat) => {
                if (chat._id !== chatId) {
                    return chat;
                }

                return {
                    ...chat,
                    messages: [
                        ...(Array.isArray(chat.messages) ? chat.messages : []),
                        userPrompt,
                    ],
                };
            });
        });

        setSelectedChats((previousChat) => {
            if (!previousChat) {
                return previousChat;
            }

            return {
                ...previousChat,
                messages: [
                    ...(Array.isArray(previousChat.messages)
                        ? previousChat.messages
                        : []),
                    userPrompt,
                ],
            };
        });

        try {
            // --------------------------------
            // Send prompt to API
            // --------------------------------

            const { data } = await axios.post("/api/ai", {
                chatId,
                prompt: promptCopy,
            });

            if (!data?.success) {
                toast.error(data?.message || "Something went wrong");
                setPrompt(promptCopy);
                return;
            }

            const aiMessage = data.data;

            if (!aiMessage) {
                toast.error("AI response is empty");
                setPrompt(promptCopy);
                return;
            }

            // --------------------------------
            // Create temporary assistant message
            // --------------------------------

            const assistantMessage = {
                role: "assistant",
                content: "",
                timestamp: Date.now(),
            };

            // Add empty assistant message
            setSelectedChats((previousChat) => {
                if (!previousChat) {
                    return previousChat;
                }

                return {
                    ...previousChat,
                    messages: [
                        ...(Array.isArray(previousChat.messages)
                            ? previousChat.messages
                            : []),
                        assistantMessage,
                    ],
                };
            });

            // --------------------------------
            // AI response animation
            // --------------------------------

            const message = String(aiMessage.content || "");
            const messageTokens = message.split(/\s+/);

            messageTokens.forEach((_, index) => {
                setTimeout(() => {
                    const updatedContent = messageTokens
                        .slice(0, index + 1)
                        .join(" ");

                    setSelectedChats((previousChat) => {
                        if (!previousChat) {
                            return previousChat;
                        }

                        const messages = Array.isArray(previousChat.messages)
                            ? previousChat.messages
                            : [];

                        const updatedMessages = messages.map(
                            (msg, msgIndex) => {
                                if (msgIndex === messages.length - 1) {
                                    return {
                                        ...msg,
                                        content: updatedContent,
                                    };
                                }

                                return msg;
                            },
                        );

                        return {
                            ...previousChat,
                            messages: updatedMessages,
                        };
                    });
                }, index * 40);
            });

            // --------------------------------
            // Update chats list after response
            // --------------------------------

            setTimeout(
                () => {
                    setChats((previousChats) => {
                        if (!Array.isArray(previousChats)) {
                            return previousChats;
                        }

                        return previousChats.map((chat) => {
                            if (chat._id !== chatId) {
                                return chat;
                            }

                            return {
                                ...chat,
                                messages: [
                                    ...(Array.isArray(chat.messages)
                                        ? chat.messages.filter(
                                              (msg) =>
                                                  msg.timestamp !==
                                                  assistantMessage.timestamp,
                                          )
                                        : []),
                                ],
                            };
                        });
                    });
                },
                messageTokens.length * 40 + 50,
            );
        } catch (error) {
            console.error("Send Prompt Error:", error);

            toast.error(
                error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong",
            );

            setPrompt(promptCopy);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            className={`w-full max-w-2xl bg-[#404045] p-4 rounded-3xl mt-4 transition-all ${selectedChats?.messages?.length > 0 ? "max-w-3xl" : "max-w-2xl"}`}
            onSubmit={sendPromptHandler}
        >
            <textarea
                className="outline-none w-full resize-none overflow-hidden wrap-break-word bg-transparent"
                rows={2}
                placeholder="Message DeepSeek"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                onKeyDown={keyDownHandler}
                disabled={loading}
                required
            />

            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                    <p className="flex items-center gap-2 text-xs border border-gray-300/4 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
                        <Image
                            className="h-5"
                            src={assets.deepthink_icon}
                            alt="Deep Thinking Icon"
                        />
                        DeepThink (R1)
                    </p>

                    <p className="flex items-center gap-2 text-xs border border-gray-300/4 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
                        <Image
                            className="h-5"
                            src={assets.search_icon}
                            alt="Search Icon"
                        />
                        Search
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Image
                        className="w-4 cursor-pointer"
                        src={assets.pin_icon}
                        alt="Pin Icon"
                    />

                    <button
                        type="submit"
                        disabled={loading || !prompt.trim()}
                        className={`rounded-full p-2 cursor-pointer ${
                            prompt.trim() ? "bg-primary" : "bg-[#71717a]"
                        }`}
                    >
                        <Image
                            className="w-3.5 aspect-square"
                            src={
                                prompt.trim()
                                    ? assets.arrow_icon
                                    : assets.arrow_icon_dull
                            }
                            alt={
                                prompt.trim() ? "Arrow Icon" : "Arrow Dull Icon"
                            }
                        />
                    </button>
                </div>
            </div>
        </form>
    );
};

export default PromptBox;
