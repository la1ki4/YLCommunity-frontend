import { useMemo } from "react";
import { getEventsBetweenDates } from "@features/get-calendar-events/api/getEventsBetweenDatesApi.js";
import { useAsyncResource } from "@shared/hooks/useAsyncResource.js";

export function useEventsBetweenDates({ startDate, endDate }) {
    const loader = useMemo(() => () => getEventsBetweenDates(startDate, endDate), [startDate, endDate]);
    const { data } = useAsyncResource(loader, [loader], []);

    return data ?? [];
}
