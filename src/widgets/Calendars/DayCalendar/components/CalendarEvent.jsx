export function CalendarEvent({
                                  className,
                                  title,
                                  description,
                                  style = {},
                              }) {
    return (
        <div
            className={className}
            style={style}
            title={description}
        >
            {title}
        </div>
    );
}


