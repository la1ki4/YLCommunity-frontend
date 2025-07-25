export function InputField({
    type, 
    placeholder, 
    className=''}){
    return(
        <>
            <input type={type} placeholder={placeholder} className={className}/>
        </>
    )
}
