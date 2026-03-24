import {useEffect} from "react";

export function useOutsideClose({refs = [], callbacks = []}) {
    useEffect(() => {
        function handleClickOutside(event) {
            refs.forEach((refItem, index) => {
                const refGroup = Array.isArray(refItem) ? refItem : [refItem];
                const isInside = refGroup.some((ref) => ref?.current?.contains(event.target));

                if (!isInside) {
                    const callbackItem = callbacks[index];

                    if (Array.isArray(callbackItem)) {
                        callbackItem.forEach((callback) => callback?.());
                        return;
                    }

                    callbackItem?.();
                }
            });
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [refs, callbacks]);
}
