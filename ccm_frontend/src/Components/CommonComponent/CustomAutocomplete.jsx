import React, { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const CustomAutocomplete = (props) => {
  const {
    options,
    label,
    value,
    name,
    size,
    onChange,
    placeholder,
    getOptionLabel,
    disabled,
    required = false,
  } = props;
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleChange = (e, newValue) => {
    if (options.length > 0) {
      const event = { target: { name: name, value: newValue } };
      onChange(event);
    }
  };

  return (
    <div>
      {options?.length > 0 ? (
        <Autocomplete
          options={options}
          getOptionLabel={(option) => getOptionLabel(option)}
          value={value}
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} label={label} />}
          size={size}
          disabled={disabled}
          required={required}
          sx={{
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "#777777",
              cursor: "not-allowed",
            },
          }}
        />
      ) : (
        <TextField
          className="w-full"
          label={label}
          value={value}
          onChange={(e) => onChange(e)}
          placeholder={placeholder}
          size={size}
          name={name}
          disabled={disabled}
          required={required}
          sx={{
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "#777777",
              cursor: "not-allowed",
            },
          }}
        />
      )}
    </div>
  );
};

export default CustomAutocomplete;
