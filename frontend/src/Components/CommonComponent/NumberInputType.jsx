import { TextField } from "@mui/material";
import React from "react";

export function NumberInputType({
  className,
  onChange,
  value,
  label,
  id,
  inputProps,
  ...props
}) {
  const exceptThisSymbols = ["e", "E", "+", "-", "."];

  return (
    <TextField
      id={id}
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
