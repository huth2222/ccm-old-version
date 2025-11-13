import { TextField } from "@mui/material";

const TextInputDisabled = (props) => {
  const {
    name,
    label,
    type,
    size = "small",
    value,
    error = null,
    onChange,
    disabled = true,
    ...other
  } = props;

  return (
    <TextField
      variant="outlined"
      type="text"
      label={label}
      name={name}
      value={value}
      size={size}
      onChange={onChange}
      {...other}
      disabled={disabled}
      sx={{
        "& .MuiInputBase-input.Mui-disabled": {
          WebkitTextFillColor: "#777777",
          cursor: "not-allowed",
        },
      }}
    />
  );
};

export default TextInputDisabled;
