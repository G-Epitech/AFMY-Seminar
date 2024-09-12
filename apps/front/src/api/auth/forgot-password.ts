import { InPostAuthForgotPasswordDto } from "@seminar/common";
import { call } from "../call";

export function forgotPassword(body: InPostAuthForgotPasswordDto) {
    return call<InPostAuthForgotPasswordDto, undefined>(
        "POST",
        "/auth/forgot-password",
        body,
        false
    );
}
