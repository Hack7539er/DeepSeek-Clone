import Image from "next/image";
import { assets } from "@/assets/assets";
import { useState } from "react";

const PromptBox = ( { loading, setIsLoading } ) => {
    const [prompt, setPrompt] = useState("");

    return (
        <form
            className={`w-full bg-[#404045] p-4 rounded-3xl mt-4 transition-all ${false ? "max-w-3xl" : "max-w-2xl"}`}
        >
            <textarea
                className="outline-none w-full resize-none overflow-hidden wrap-break-word bg-transparent"
                rows={2}
                placeholder="Message DeepSeek"
                value={prompt}
                onChange={(Event) => setPrompt(Event.target.value)}
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
                        className={`rounded-full p-2 cursor-pointer ${prompt ? "bg-primary" : "bg-[#71717a]"}`}
                    >
                        <Image
                            className="w-3.5 aspect-square"
                            src={
                                prompt
                                    ? assets.arrow_icon
                                    : assets.arrow_icon_dull
                            }
                            alt={prompt ? "Arrow Icon" : "Arrow Dull Icon"}
                        />
                    </button>
                </div>
            </div>
        </form>
    );
};

export default PromptBox;
