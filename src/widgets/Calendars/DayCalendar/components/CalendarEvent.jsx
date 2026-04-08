import {forwardRef} from "react";

export const CalendarEvent = forwardRef(function CalendarEvent({
                                                                   className,
                                                                   title,
                                                                   description,
                                                                   style = {},
                                                                   onClick
                                                               }, ref) {
    return (
        <button
            ref={ref}
            type="button"
            className={className}
            style={style}
            title={description}
            onClick={onClick}
        >
            {title}
        </button>
    );
});
