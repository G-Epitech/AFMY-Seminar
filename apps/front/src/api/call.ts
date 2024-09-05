import { credentials } from "@/auth/credentials";
import { config } from "@/lib/config";

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
    if (!config.api.url)
        throw new Error("API_URL is not defined in config file");

    const tokens = credentials.get();
    if (auth && !tokens.access) return null;

    try {
        const response = await fetch(`${config.api.url}${endpoint}`, {
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
