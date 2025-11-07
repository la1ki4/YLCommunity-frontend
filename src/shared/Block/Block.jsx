export function Block({
                          className = '',
                          as: Component = 'div',
                          children,
                          ...restProps
                      }) {
    return (
        <Component className={className} {...restProps}>
            {children}
        </Component>
    )
}
