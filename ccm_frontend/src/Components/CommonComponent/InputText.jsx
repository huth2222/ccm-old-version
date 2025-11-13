import { TextField } from "@mui/material";

export default function InputText({
  className,
  onChange,
  value,
  label,
  name,
  inputProps,
  size = "small",
  placeholder,
  wordLength,
  mt,
  ...props
}) {
  return (
    <TextField
      className={className}
      label={label}
      value={value}
      name={name}
      onChange={onChange}
      autoComplete="off"
      placeholder={placeholder}
      size={size}
      inputProps={{ maxLength: wordLength }}
      sx={{
        "& .MuiInputBase-input.Mui-disabled": {
          WebkitTextFillColor: "#777777",
          cursor: "not-allowed",
        },
        marginTop: `${mt}`,
      }}
      {...props}
    />
  );
}
