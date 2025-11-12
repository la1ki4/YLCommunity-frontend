import {forwardRef} from "react";

export const InputField = forwardRef
(({
      name,
      type,
      placeholder,
      value,
      onChange,
      className,
      ...restProps
  }, ref) => {
    return(
        <input
            name={name}
            type={type}
            placeholder={placeholder}
            className={className}
            value={value}
            onChange={onChange}
            ref={ref}
            {...restProps}
        />);
});


