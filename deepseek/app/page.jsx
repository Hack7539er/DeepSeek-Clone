"use client";

import { useState } from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar.jsx";
import { assets } from "@/assets/assets.js";
import PromptBox from "@/components/PromptBox";

export default function Home() {
    const [expand, setExpand] = useState(false);
    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState([]);

    return (
        <div>
            <div className="flex h-screen">

                {/* DeepSeek Sidebar */}
                <Sidebar expand = { expand } setExpand = { setExpand } />

                {/* Mobile View */}
                <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#292a2d] text-white relative">
                    <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
                        <Image
                            className="rotate-180"
                            src={assets.menu_icon}
                            alt="Menu Icon"
                            onClick={() =>
                                expand ? setExpand(false) : setExpand(true)
                            }
                        />
                        <Image
                            className="opacity-70"
                            src={assets.chat_icon}
                            alt="Chat Icon"
                        />
                    </div>
                    {message.length === 0 ? (
                        <>
                            <div className="flex items-center gap-3">
                                <Image
                                    className="h-16"
                                    src={assets.logo_icon}
                                    alt="Logo Icon"
                                />
                                <p className="text-2xl font-medium">
                                    Hi, I&apos;m DeepSeek.
                                </p>
                            </div>
                            <p className="text-sm mt-2">
                                How Can I Help You Today?
                            </p>
                        </>
                    ) : (
                        <div></div>
                    )}

                    {/* Prompt Box */}
                    <PromptBox isloading = { loading } setIsLoading = { setLoading } />
                    <p className="text-xs absolute bottom-1 text-gray-500">AI-Generated, For Reference Only</p>
                </div>
            </div>
        </div>
    );
}
