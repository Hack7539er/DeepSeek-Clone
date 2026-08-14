import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";

const ChatLabel = ({ openMenu, setOpenMenu, id, name }) => {
    const { fetchUserChats, chats, setSelectedChats } = useAppContext();

    const selectChat = () => {
        const chatData = chats.find((chat) => chat._id === id);

        setSelectedChats(chatData);
    };

    const renameHandler = async () => {
        try {
            const newName = prompt("Enter New Name");

            if (!newName) return;

            const { data } = await axios.post("api/chat/rename", {
                chatId: id,
                name: newName,
            });

            if (data.success) {
                fetchUserChats();

                setOpenMenu({ id: 0, open: false });

                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (Error) {
            console.log("Error: Renamed Failed. Exception: ", Error);

            toast.error(Error.message);
        }
    };

    const deleteChatHandler = async () => {
        try {
            const confirm = window.confirm(
                "Are You Sure You Want to Delete This Chat",
            );

            if (!confirm) return;

            const { data } = await axios.post("api/chat/delete", {
                chatId: id,
            });

            if (data.success) {
                fetchUserChats();

                setOpenMenu({ id: 0, open: false });

                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (Error) {
            console.log("Error: Chat Deleting Failed. Exception: ", Error);

            toast.error(Error.message);
        }
    };

    const showMenuOnMouseEvent = (Event) => {
        Event.preventDefault();

        if (openMenu.open) setOpenMenu({ id: 0, open: false });

        if (Event.button === 2) {
            if (!openMenu.open) setOpenMenu({ id: 0, open: true });
        }
    };

    return (
        <div
            className="flex items-center justify-between p-2 text-white/80 hover:bg-white/10 rounded-lg text-sm group cursor-pointer"
            onClick={selectChat}
        >
            <p className="group-hover:max-w-5/6 truncate"> {name} </p>
            <div
                className="group relative flex items-center justify-center w-6 h-6 aspect-square hover:bg-black/80 rounded-lg"
                onClick={(Event) => {
                    Event.stopPropagation();
                    setOpenMenu({ id: id, open: !openMenu.open });
                    showMenuOnMouseEvent(Event);
                }}
                onContextMenu={(Event) => showMenuOnMouseEvent(Event)}
            >
                <Image
                    className={`w-4 group-hover:block ${openMenu.id === id && openMenu.open ? "" : "hidden"}`}
                    src={assets.three_dots}
                    alt="Three Dot Icon"
                />

                {openMenu.id === id && openMenu.open && (
                    <div className="absolute -right-36 top-6 bg-gray-700 rounded-xl w-max p-2">
                        <div
                            className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg"
                            onClick={renameHandler}
                        >
                            <Image
                                className="w-4"
                                src={assets.pencil_icon}
                                alt="Pencil Icon"
                            />
                            <p>Rename</p>
                        </div>
                        <div
                            className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg"
                            onClick={deleteChatHandler}
                        >
                            <Image
                                className="w-4"
                                src={assets.delete_icon}
                                alt="Delete Icon"
                            />
                            <p>Delete</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatLabel;
