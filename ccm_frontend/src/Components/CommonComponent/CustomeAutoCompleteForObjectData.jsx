import React, { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const CustomeAutoCompleteForObjectData = (props) => {
  const {
    options,
    label,
    value,
    name,
    size,
    onChange,
    placeholder,
    disabled,
    required = false,
    getOptionLabel,
    error,
  } = props;

  const [inputValue, setInputValue] = useState("");
  const [isTyped, setIsTyped] = useState(false);

  const handleInputChange = (event, newInputValue) => {
    // console.log(newInputValue);
    if (newInputValue === "undefined - undefined") {
      setIsTyped(false);
    } else {
      setIsTyped(true);
    }
    setInputValue(newInputValue);
  };

  const handleChange = (e, newValue) => {
    if (options.length > 0) {
      const event = { target: { name: name, value: newValue } };
      onChange(event);
    }
  };

  const handleBlur = () => {
    if (inputValue === "" && value !== "") {
      onChange({ target: { name: name, value: "" } });
      setIsTyped(false);
    }
  };

  return (
    <div>
      {options?.length > 0 ? (
        <Autocomplete
          options={options}
          getOptionLabel={(option) => getOptionLabel(option)}
          value={value}
          inputValue={isTyped ? inputValue : ""}
          onInputChange={handleInputChange}
          onChange={handleChange}
          onBlur={handleBlur}
          renderInput={(params) => (
            <TextField
              error={error}
              required={required}
              {...params}
              label={label}
            />
          )}
          size={size}
          disabled={disabled}
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
          error={error}
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

export default CustomeAutoCompleteForObjectData;
