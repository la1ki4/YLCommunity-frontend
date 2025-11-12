export function Button(
    {
        label = '',
        type = '',
        className = '',
        ...restProps
    }
) {
    return (
        <button className={className} type={type} {...restProps}>{label}</button>
    )
} 