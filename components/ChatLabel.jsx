import { assets } from "@/assets/assets";
import Image from "next/image";

const ChatLabel = ({ openMenu, setOpenMenu }) => {

    const showMenuOnMouseEvent = (Event) => {

        Event.preventDefault();

        if (openMenu.open) setOpenMenu( { id: 0, open: false } ); 
        
        if (Event.button === 2) {

            if (!openMenu.open) setOpenMenu( { id: 0, open: true } ); 
        }
    };

    return (
        <div className="flex items-center justify-between p-2 text-white/80 hover:bg-white/10 rounded-lg text-sm group cursor-pointer">
            <p className="group-hover:max-w-5/6 truncate">Chat Name Here</p>
            <div className="group relative flex items-center justify-center w-6 h-6 aspect-square hover:bg-black/80 rounded-lg" onClick = {Event => showMenuOnMouseEvent(Event)} onContextMenu = { Event => showMenuOnMouseEvent(Event) }>
                <Image
                    className={`w-4 group-hover:block ${openMenu.open ? "" : "hidden"}`}
                    src={assets.three_dots}
                    alt="Three Dot Icon"
                />

                {openMenu.open && (
                    <div className="absolute -right-36 top-6 bg-gray-700 rounded-xl w-max p-2">
                        <div className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg">
                            <Image
                                className="w-4"
                                src={assets.pencil_icon}
                                alt="Pencil Icon"
                            />
                            <p>Rename</p>
                        </div>
                        <div className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg">
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
