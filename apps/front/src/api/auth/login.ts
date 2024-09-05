import { call } from "../call";

export function login(body: { username: string; password: string }) {
    return call("POST", "/auth/login", body, false);
}
