import {useEffect,useState} from "react";
import { getUserDataApi } from "@features/calendar/requests/get-calendar-user/api/getUserDataApi.js";

export function useUserTimeZoneLocation() {
    const [userTimezoneLocation, setUserTimezoneLocation] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadUserTimeZoneLocation() {
            try {
                const user = await getUserDataApi();
                if (!isMounted) return;
                const userTimezone = `${user.userTimeZone}`;
                setUserTimezoneLocation(userTimezone);
            } catch (error) {
                if (!isMounted) return;

                console.error("Failed to load user timezone", error);
            }
        }

        loadUserTimeZoneLocation();

        return () => {
            isMounted = false;
        };
    }, [userTimezoneLocation]);

    return {
        userTimezoneLocation,
    }
}