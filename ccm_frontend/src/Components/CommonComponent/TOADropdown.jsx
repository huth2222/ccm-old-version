import React from "react";
import { Select, FormControl, InputLabel, MenuItem } from "@mui/material";

const TOADropdown = ({
  label,
  value,
  onChange,
  required,
  dataList,
  name,
  valueKey,
  valueLabel,
  valueLabel2 = "",
  size = "small",
  className = "w-full",
  dataArrayOfObject = true,
  needMargin = "0px",
  style,
  error = false,
  ...props
}) => {
  return (
    <>
      {dataArrayOfObject ? (
        <FormControl
          className={className}
          required={required}
          sx={{ ...style }}
        >
          <InputLabel error={error} size={size}>
            {label}
          </InputLabel>
          <Select
            value={value}
            onChange={onChange}
            name={name}
            label={label}
            size={size}
            error={error}
            required={required}
            {...props}
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#777777",
                cursor: "not-allowed",
              },
            }}
          >
            {Array.isArray(dataList) && dataList.length > 0 ? (
              dataList.map((option, index) => (
                <MenuItem key={option._id} value={option[valueKey]}>
                  {valueLabel2
                    ? `${option[valueLabel]} - ${option[valueLabel2]}`
                    : option[valueLabel]}
                </MenuItem>
              ))
            ) : (
              <MenuItem>Loading...</MenuItem>
            )}
          </Select>
        </FormControl>
      ) : (
        <FormControl
          sx={{ marginTop: needMargin }}
          className={className}
          required={required}
        >
          <InputLabel size={size}>{label}</InputLabel>
          <Select
            value={value}
            onChange={onChange}
            name={name}
            label={label}
            size={size}
            {...props}
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#777777",
                cursor: "not-allowed",
              },
            }}
          >
            {Array.isArray(dataList) && dataList.length > 0 ? (
              dataList.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))
            ) : (
              <MenuItem>Loading...</MenuItem>
            )}
          </Select>
        </FormControl>
      )}
    </>
  );
};

export default TOADropdown;
