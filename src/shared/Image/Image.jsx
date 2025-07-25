export function Image(
    {
        image, 
        className='', 
        alt='', 
        style={}
    }){
    return(
        <img src={image} alt={alt} className={className} style={style}/>
    )
}