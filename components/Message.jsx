import { assets } from "@/assets/assets";
import { useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import Prism from "prismjs";

const Message = ({ role, content }) => {

    useEffect(() => {
        Prism.highlightAll();
    }, [content]);


    const copyMessage = () => {

        navigator.clipboard.writeText(content);
        toast.success("Message Copied To Clipboard");
    }

    return (
        <div className="flex flex-col items-center w-full max-w-3x text-sm">
            <div
                className={`flex flex-col w-full mb-8 ${role === "user" && "items-end"}`}
            >
                <div
                    className={`group relative flex max-w-2xl py-4 rounded-xl ${role === "user" ? "bg-[#414158] px-5" : "gap-3"}`}
                >
                    <div
                        className={`opacity-0 group-hover:opacity-100 absolute transition-all ${role === "user" ? "-left-16 top-2.5" : "left-9 -bottom-6"}`}
                    >
                        <div className="flex items-center gap-2 opacity-70">
                            {role === "user" ? (
                                <>
                                    <Image
                                        className="w-4 cursor-pointer"
                                        src={assets.copy_icon}
                                        alt="Copy Icon"
                                        onClick = {copyMessage}
                                    />
                                    <Image
                                        className="w-4 cursor-pointer"
                                        src={assets.pencil_icon}
                                        alt="Pencil Icon"
                                    />
                                </>
                            ) : (
                                <>
                                    <Image
                                        className="w-4 cursor-pointer"
                                        src={assets.copy_icon}
                                        alt="Copy Icon"
                                        onClick = {copyMessage}
                                    />
                                    <Image
                                        className="w-4 cursor-pointer"
                                        src={assets.regenerate_icon}
                                        alt="Regenerate Icon"
                                    />
                                    <Image
                                        className="w-4 cursor-pointer"
                                        src={assets.like_icon}
                                        alt="Like Icon"
                                    />
                                    <Image
                                        className="w-4 cursor-pointer"
                                        src={assets.dislike_icon}
                                        alt="Dislike Icon"
                                    />
                                </>
                            )}
                        </div>
                    </div>
                    {role === "user" ? (
                        <span className="text-white/90">{content}</span>
                    ) : (
                        <>
                            <Image
                                className="w-9 h-9 p-1 border border-white/15 rounded-full"
                                src={assets.logo_icon}
                                alt="Logo Icon"
                            />
                            <div className="space-y-4 w-full overflow-scroll">
                                <Markdown>
                                    { content }
                                </Markdown>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Message;
