export function Text({
                         text,
                         className = '',
                         as: Component = 'span',
                         style,
                         ...restProps
                     }) {
    return (
        <Component
            className={className}
            style={style}
            {...restProps}
        >
            {text}
        </Component>
    );
}