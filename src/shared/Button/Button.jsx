import React from "react";

export const Button = React.forwardRef(function Button(
    {
        children,
        type = "button",
        className = "",
        leftIcon = null,
        rightIcon = null,
        ...restProps
    },
    ref
) {
    return (
        <button
            ref={ref}
            type={type}
            className={`btn ${className}`}
            {...restProps}
        >
            {leftIcon}
            {children}
            {rightIcon}
        </button>
    );
});