export function InputNumber({ className, onChange, value, label, ...props }) {
  const exceptThisSymbols = ["e", "E", "+", "-", "."];

  return (
    <input
      id={label}
      className={className}
      label={label}
      value={value}
      onChange={onChange}
      autoComplete="off"
      type="number"
      onWheel={(e) => e.target.blur()}
      onKeyDown={(e) => exceptThisSymbols.includes(e.key) && e.preventDefault()}
      {...props}
    />
  );
}
