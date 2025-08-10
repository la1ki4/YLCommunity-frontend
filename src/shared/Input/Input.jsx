export function InputField({
  name,
  type,
  placeholder,
  value,
  onChange,
  className = ''
}) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      className={className}
      value={value}
      onChange={onChange}
    />
  );
}
