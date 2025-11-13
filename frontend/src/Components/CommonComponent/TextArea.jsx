// import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { TextareaAutosize } from "@mui/material";
import { styled } from "@mui/system";
import { useState } from "react";

export default function TextArea({ wordCound, handleChange, comment }) {
  const blue = {
    100: "#DAECFF",
    200: "#b6daff",
    400: "#3399FF",
    500: "#007FFF",
    600: "#0072E5",
    900: "#003A75",
  };

  const grey = {
    50: "#f6f8fa",
    100: "#eaeef2",
    200: "#d0d7de",
    300: "#afb8c1",
    400: "#8c959f",
    500: "#6e7781",
    600: "#57606a",
    700: "#424a53",
    800: "#32383f",
    900: "#24292f",
  };

  const Textarea = styled(TextareaAutosize)(
    ({ theme }) => `
    width: 360px;
    font-family: IBM Plex Sans, sans-serif;
    line-height: 1.5;
    padding: 12px;
    border-radius: 12px 12px 12px 12px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${
      theme.palette.mode === "dark" ? grey[900] : grey[50]
    };

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === "dark" ? blue[500] : blue[200]
      };
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
  );

  // console.log(wordCound, comment);

  return (
    <>
      <Textarea
        className="mt-2"
        aria-label="minimum height"
        minRows={3}
        placeholder="Give Your Comments Here."
        maxLength={500}
        value={comment}
        onChange={handleChange}
        sx={{ resize: "none" }}
        // autoFocus
      />
      <p className="ml-1">{`${wordCound}/500`}</p>
    </>
  );
}
