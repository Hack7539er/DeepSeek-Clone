"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext(null);

export const useAppContext = () => {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error("useAppContext must be used inside AppContextProvider");
    }

    return context;
};

export const AppContextProvider = ({ children }) => {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();

    const [chats, setChats] = useState([]);
    const [selectedChats, setSelectedChats] = useState(null);

    const createNewChat = async () => {
        try {
            if (!user) return null;

            const token = await getToken();

            const { data } = await axios.post(
                "/api/chat/create",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (!data.success) {
                toast.error(data.message);
                return null;
            }

            fetchUserChats()

            return data.data;
        } catch (error) {
            console.error("Create Chat Error:", error);
            toast.error(error.message);
            return null;
        }
    };

    const fetchUserChats = async () => {
        try {
            if (!user) return;

            const token = await getToken();

            const { data } = await axios.get("/api/chat/get", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!data.success) {
                toast.error(data.message);
                return;
            }

            let chatList = Array.isArray(data.data) ? data.data : [];

            chatList = chatList.map((chat) => ({
                ...chat,
                messages: Array.isArray(chat.messages) ? chat.messages : [],
            }));

            chatList.sort(
                (x, y) =>
                    new Date(y.updatedAt).getTime() -
                    new Date(x.updatedAt).getTime(),
            );

            if (chatList.length === 0) {
                const newChat = await createNewChat();

                if (!newChat) {
                    return;
                }

                const formattedChat = {
                    ...newChat,
                    messages: Array.isArray(newChat.messages)
                        ? newChat.messages
                        : [],
                };

                setChats([formattedChat]);
                setSelectedChats(formattedChat);

                return;
            }

            setChats(chatList);
            setSelectedChats(chatList[0]);
        } catch (error) {
            console.error("Fetch Chats Error:", error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (!isLoaded) return;

        if (user) {
            fetchUserChats();
        } else {
            setChats([]);
            setSelectedChats(null);
        }
    }, [user, isLoaded]);

    const value = {
        user,
        chats,
        setChats,
        selectedChats,
        setSelectedChats,
        fetchUserChats,
        createNewChat,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
