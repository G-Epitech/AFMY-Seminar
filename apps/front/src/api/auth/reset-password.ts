import { InPostAuthResetPasswordDto } from "@seminar/common";
import { call } from "../call";

export function resetPassword(body: InPostAuthResetPasswordDto) {
    return call<InPostAuthResetPasswordDto, undefined>(
        "POST",
        "/auth/reset-password",
        body,
        false
    );
}
