import { useEffect, useState } from "react";

export function useNow(intervalMs = 30_000) {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const tick = () => setNow(new Date());

        tick(); // сразу обновляем
        const id = setInterval(tick, intervalMs);

        return () => clearInterval(id);
    }, [intervalMs]);

    return now;
}
