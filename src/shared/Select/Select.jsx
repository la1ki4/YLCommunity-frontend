import { forwardRef } from "react";

export const SelectField = forwardRef(({
                                           name,
                                           value,
                                           onChange,
                                           className,
                                           options = [],
                                           ...restProps
                                       }, ref) => {
    return (
        <select
            name={name}
            value={value}
            onChange={onChange}
            className={className}
            ref={ref}
            {...restProps}
        >
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
});

