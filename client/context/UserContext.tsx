"use client";

import { createContext, useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";

interface UserValue {
    userId: string;
    userName: string;
    setUserName: (userName: string) => void;
}

export const UserContext = createContext<UserValue>({
    userId: "",
    userName: "",
    setUserName: () => {},
});

export const UserProvider = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const [userId, setUserId] = useState<string>("");
    const [userName, setUserName] = useState<string>("");

    useEffect(() => {
        // Initialize userId and userName from localStorage only in the client-side
        const storedUserId = localStorage.getItem("userId") || uuidV4();
        const storedUserName = localStorage.getItem("userName") || "username";
        
        setUserId(storedUserId);
        setUserName(storedUserName);
    }, []);

    useEffect(() => {
        // Save userName to localStorage whenever it changes
        localStorage.setItem("userName", userName);
    }, [userName]);

    useEffect(() => {
        // Save userId to localStorage whenever it changes
        localStorage.setItem("userId", userId);
    }, [userId]);

    return (
        <UserContext.Provider value={{ userId, userName, setUserName }}>
            {children}
        </UserContext.Provider>
    );
};
