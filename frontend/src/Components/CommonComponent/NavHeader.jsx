import { Button, InputAdornment, MenuItem, TextField } from "@mui/material";
import profileLogo from "../../assets/profile-icon.svg";
import { Search } from "@mui/icons-material";
import NavBar from "./NavBar";

const NavHeader = ({
  headingText,
  fromDate = "true",
  toDate = "true",
  createButton = "true",
  menuItem = ["Not Added"],
  handleDropDownSelect,
  filterNeeded = true,
  setSearchWord,
  searchText,
}) => {
  const handleDropdown = (e) => {
    handleDropDownSelect(e);
    setSearchWord("");
  };
  return (
    <div className="">
      {/* <div className="flex justify-between py-4 px-6 bg-[#0B834E]">
        <h1 className="text-white text-4xl">{headerText}</h1>
        <ProfileMenu />
      </div> */}
      <NavBar headerText={headingText} />
      {filterNeeded && (
        <div className="flex justify-between items-center flex-wrap py-6 px-6">
          <div>
            <TextField
              className="w-auto"
              label="Search"
              type="search"
              size="small"
              placeholder="Search By ID."
              style={{ background: "#FEFCFC" }}
              id="search"
              value={searchText}
              onChange={(e) => setSearchWord(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className="flex items-center flex-wrap">
            {fromDate && (
              <TextField
                className="w-48"
                id="todate"
                size="small"
                label="End Date"
                type="date"
                value=" "
                style={{ marginRight: "12px" }}
              />
            )}
            {toDate && (
              <TextField
                className="w-48"
                id="fromdate"
                size="small"
                label="Start Date"
                type="date"
                value=" "
                style={{ marginRight: "12px" }}
              />
            )}

            <TextField
              className="w-48"
              size="small"
              id="user-dropdown"
              select
              label="Select Status"
              defaultValue="Active"
              style={{ marginRight: "12px" }}
              onChange={(e) => handleDropdown(e)}
            >
              <MenuItem name="Active" value="Active">
                Active
              </MenuItem>
              {menuItem.map((item) => {
                return (
                  <MenuItem name={item} value={item} key={item}>
                    {item}
                  </MenuItem>
                );
              })}
            </TextField>
            {createButton && (
              <Button className="w-48" variant="contained">
                Create
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavHeader;
