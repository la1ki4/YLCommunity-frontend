export function Media(
    {
        image, 
        className='', 
        alt='', 
        style={},
        as : Component = 'img',
        ...restProps
    }){
    return(
        <Component src={image} alt={alt} className={className} style={style} {...restProps}/>
    )
}