import { OutPostAuthLogInDto } from "@seminar/common";

export const credentials = {
    save: async (tokens: OutPostAuthLogInDto['tokens']) => {
        localStorage.setItem("access_token", tokens.access);
    },

    get: () => {
        const access = localStorage.getItem("access_token");

        return { access };
    },

    remove: () => {
        localStorage.removeItem("access_token");
    },
};
