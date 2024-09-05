import { InPostAuthLogInDto, OutPostAuthLogInDto } from "@seminar/common";
import { call } from "../call";

export function login(body: InPostAuthLogInDto) {
    return call<InPostAuthLogInDto, OutPostAuthLogInDto>(
        "POST",
        "/auth/login",
        body,
        false
    );
}
