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
            {leftIcon && <span className="btn__icon btn__icon--left">{leftIcon}</span>}
            {children && <span className="btn__label">{children}</span>}
            {rightIcon && <span className="btn__icon btn__icon--right">{rightIcon}</span>}
        </button>
    )
}