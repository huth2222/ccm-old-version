import React, { memo, useEffect, useState } from "react";
import "./searchwithDropdown.css";
import {
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  IconButton,
} from "@mui/material";
import { Search, Clear } from "@mui/icons-material";

function SearchWithDropdown({ setSearchWord, dropdownRequired, searchWord }) {
  const [searchValue, setSearchValue] = useState("");
  const [topic, setTopic] = useState("default");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    name === "topic" ? setTopic(value) : setSearchValue(value);
  };

  const handleClearSearch = () => {
    setSearchValue("");
  };

  useEffect(() => {
    const getData = setTimeout(() => {
      setSearchWord(searchValue);
    }, 600);

    return () => clearTimeout(getData);
  }, [searchValue]);

  useEffect(() => {
    setSearchValue(searchWord);
  }, [searchWord]);

  //   console.log(topic, searchValue);

  return (
    <div className="w-68">
      {dropdownRequired ? (
        <div className="mui-input">
          <div className="mui-input-field flex w-68">
            <FormControl size="small" className="w-36">
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={topic}
                label=""
                size="small"
                name="topic"
                sx={{
                  borderRadius: 0,
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: 0,
                  },
                  "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      border: "none",
                    },
                }}
                onChange={handleInputChange}
              >
                <MenuItem disabled value={"default"}>
                  Select Topic
                </MenuItem>
                <MenuItem value={"taxId"}>Tax ID</MenuItem>
                <MenuItem value={"customer"}>Customer Name/ID</MenuItem>
                <MenuItem value={"sales"}>Sales Person Name/ID</MenuItem>
              </Select>
            </FormControl>
            <TextField
              placeholder="Search"
              value={searchValue}
              onChange={handleInputChange}
              size="small"
              className="w-48"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {searchValue ? (
                      <IconButton onClick={handleClearSearch}>
                        <Clear />
                      </IconButton>
                    ) : (
                      <IconButton>
                        <Search />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
              sx={{
                borderLeft: "1px solid gray",
                boxShadow: "none",
                ".MuiOutlinedInput-notchedOutline": { border: 0 },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    border: "none",
                  },
                },
              }}
            />
          </div>
          <label className="mui-input-label">Search By</label>
        </div>
      ) : (
        <TextField
          className="w-auto"
          label="Search"
          //   type="search"
          size="small"
          placeholder="Search By Name or TaxID."
          value={searchValue}
          onChange={handleInputChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {searchValue ? (
                  <IconButton onClick={handleClearSearch}>
                    <Clear />
                  </IconButton>
                ) : (
                  <IconButton>
                    <Search />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
      )}
    </div>
  );
}

export default memo(SearchWithDropdown);
