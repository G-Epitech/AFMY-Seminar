import { forgotPassword } from "./forgot-password";
import { login } from "./login";
import { resetPassword } from "./reset-password";

const auth = {
    login,
    resetPassword,
    forgotPassword,
};

export default auth;
