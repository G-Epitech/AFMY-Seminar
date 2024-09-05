import { credentials } from "@/auth/credentials";

interface Response<R> {
    ok: boolean;
    data: R;
    statusCode?: number;
    message?: string;
    errors?: { [key: string]: string };
}

export const call = async function <T, R>(
    method: string,
    endpoint: string,
    body?: T,
    auth = true
): Promise<Response<R> | null> {
    if (!process.env.API_URL)
        throw new Error("API_URL is not defined in env file");

    const tokens = credentials.get();
    if (auth && !tokens.access) return null;

    try {
        const response = await fetch(`${process.env.API_URL}${endpoint}`, {
            method,
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                Authorization: auth ? `Bearer ${tokens.access}` : "",
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        const data = await response.json();
        if (response.ok) {
            return {
                ok: response.ok,
                data,
            };
        }

        return {
            ok: false,
            data: null,
            ...data,
        };
    } catch (error) {
        console.error(error);
        return null;
    }
};
