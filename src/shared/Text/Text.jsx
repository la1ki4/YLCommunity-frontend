export function Text(
    {
    text, 
    className='',
    as : Component = 'span',
    ...restProps 
}) {
    return(
        <Component className={className} {...restProps}>{text}</Component>
    )
}