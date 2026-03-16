import { useEffect, useState } from "react";
import { getUserFullNameApi } from "@features/get-calendar-user/api/getUserFullNameApi.js";

export function useUserFullName() {
    const [userFullName, setUserFullName] = useState("");
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [userError, setUserError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function loadUser() {
            try {
                setIsLoadingUser(true);
                setUserError(null);

                const user = await getUserFullNameApi();

                if (!isMounted) return;

                const fullName = `${user.firstName} ${user.lastName}`.trim();
                setUserFullName(fullName);
            } catch (error) {
                if (!isMounted) return;

                console.error("Failed to load user", error);
                setUserError(error);
                setUserFullName("");
            } finally {
                setIsLoadingUser(false);
            }
        }

        loadUser();

        return () => {
            isMounted = false;
        };
    }, []);

    return {
        userFullName,
        isLoadingUser,
        userError,
    };
}