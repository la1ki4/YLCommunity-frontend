export function CalendarEvent({
                                  className,
                                  title,
                                  description,
                                  style = {},
                                  onClick,
                              }) {
    return (
        <button
            type="button"
            className={className}
            style={style}
            title={description}
            onClick={onClick}
        >
            {title}
        </button>
    );
}
