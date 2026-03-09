import { apiRequest } from "./apiClient";

export interface LoginResponse {
    access_token: string;
    token_type: string;
    role: string;
}

export interface UserInfo {
    username: string;
    role: string;
}

export const authApi = {
    /** POST /api/auth/login — returns JWT token */
    login: (username: string, password: string): Promise<LoginResponse> =>
        apiRequest<LoginResponse>("/api/auth/login", {
            method: "POST",
            body: { username, password },
        }),

    /** GET /api/auth/me — validates token and returns user info */
    me: (token: string): Promise<UserInfo> =>
        apiRequest<UserInfo>("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
        }),
};
