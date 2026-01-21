export function Button({
                           children,
                           type = 'button',
                           className = '',
                           leftIcon = null,
                           rightIcon = null,
                           ...restProps
                       }) {
    return (
        <button
            type={type}
            className={`btn ${className}`}
            {...restProps}
        >
            {leftIcon}
            {children}
            {rightIcon}
        </button>
    )
}