import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import "./primsHighlight.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export const metadata = {
    title: "Deepseek",
    description: "Fullstack Deepseek Project",
};

export default function RootLayout({ children }) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${inter.className} antialiased`}>
                    <AppContextProvider>
                        <Toaster
                            toastOptions={{
                                success: {
                                    style: {
                                        background: "black",
                                        color: "white",
                                    },
                                },
                                error: {
                                    style: {
                                        background: "black",
                                        color: "red",
                                    },
                                },
                            }}
                        />

                        {children}
                    </AppContextProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
