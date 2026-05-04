import {logoutRequest} from "@features/auth/logout/logout.js";

export function useLogout() {
    return async (e) => {
        e.preventDefault();

        try {
            await logoutRequest();
        } catch (err) {
            console.error("Logout failed:", err);
        }

        window.location.reload();
    };
}