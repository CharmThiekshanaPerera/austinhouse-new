import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { authApi, UserInfo } from "@/lib/authApi";

interface AuthContextValue {
    user: UserInfo | null;
    token: string | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "ah_admin_token";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
    const [user, setUser] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Validate token on mount (and any time token changes)
    useEffect(() => {
        if (!token) {
            setUser(null);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        authApi
            .me(token)
            .then(setUser)
            .catch(() => {
                // Token is invalid or expired — clear it
                localStorage.removeItem(TOKEN_KEY);
                setToken(null);
                setUser(null);
            })
            .finally(() => setIsLoading(false));
    }, [token]);

    const login = useCallback(async (username: string, password: string) => {
        const response = await authApi.login(username, password);
        localStorage.setItem(TOKEN_KEY, response.access_token);
        setToken(response.access_token);
        setUser({ username, role: response.role });
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextValue => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
};
