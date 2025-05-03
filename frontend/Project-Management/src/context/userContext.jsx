import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPath";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (user) return;

            const accessToken = localStorage.getItem("access_token");
            if (!accessToken) {
                setLoading(false);
                return;
            }

            try {
                const response = await axiosInstance.get(API_PATH.AUTH.GET_PROFILE);
                setUser(response.data); // Memindahkan setUser ke tempat yang benar
            } catch (error) {
                console.error("Error fetching user data:", error);
                clearUser();
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []); // Tambahkan tanda kurung penutup di sini

    return (
        <UserContext.Provider value={{ user, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
