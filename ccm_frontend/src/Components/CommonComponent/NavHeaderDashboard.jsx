import { Button, InputAdornment, MenuItem, TextField } from "@mui/material";
// import { Search } from "@mui/icons-material";
import NavBar from "./NavBar";
import MyDatePicker from "./MyDatePicker";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import SearchWithDropdown from "./SearchWithDropdown";
import { userDashboardStore } from "../../Store/jobDashboard";
import UpdateIcon from "@mui/icons-material/Update";

export default function NavHeaderDashboard({
  headingText,
  fromDate = "true",
  toDate = "true",
  createButton = "true",
  menuItem = ["Not Added"],
  handleClickCreateButton,
  requireActionBar = true,
  needUpdateButton = false,
  onClickUpdate,
}) {
  const userData = localStorage.getItem("userData");
  const userParsedData = userData ? JSON.parse(userData) : {};
  const userRole = `${userParsedData?.userType} ${userParsedData?.role}`;

  const filterJob = userDashboardStore((state) => state.filterJob);
  const optionList = userDashboardStore((state) => state.filterOptionList);

  const {
    companyCodeSelection,
    distChannelSelection,
    statusSelection,
    statusSelectionDefault,
  } = optionList;

  // console.log(companyCodeSelection, distChannelSelection);

  const [company, setCompany] = useState("");
  const [channel, setChannel] = useState("");
  const [docStatus, setDocStatus] = useState(statusSelectionDefault);
  const [createDate, setCreateDate] = useState("");
  const [searchWord, setSearchWord] = useState("");
  const [docType, setDocType] = useState("all");

  // console.log(createDate);

  const clearFilter = () => {
    setChannel("");
    setCompany("");
    setDocStatus(statusSelectionDefault);
    setCreateDate("");
    setSearchWord("");
    setDocType("all");
  };
  const path = location.pathname;
  // console.log(path);
  useEffect(() => {
    const url = `job?searchText=${searchWord}&docstatus=${docStatus}&createDate=${createDate}&channel=${channel}&company=${company}&type=${docType}`;
    path === "/user" && filterJob(url);
    // console.log(url);
  }, [company, channel, docStatus, createDate, searchWord, docType]);

  const formatBirth = (data) => {
    try {
      if (data?.length > 0) {
        const newDate = data.split(".");
        return dayjs(newDate[2] + "-" + newDate[1] + "-" + newDate[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <NavBar headerText={headingText} />
      {requireActionBar && (
        <>
          <h1 className="mx-6 my-4 text-4xl">Request List</h1>
          <div className="flex items-center justify-between p-6">
            <div className="flex flex-wrap justify-between w-9/12">
              <SearchWithDropdown
                role={userRole}
                setSearchWord={setSearchWord}
                dropdownRequired={false}
                searchWord={searchWord}
              />
              <TextField
                className="w-40"
                size="small"
                id="user-dropdown"
                select
                label="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {companyCodeSelection?.length > 0 ? (
                  companyCodeSelection.map((item, index) => {
                    return (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    );
                  })
                ) : (
                  <MenuItem value="">Loading...</MenuItem>
                )}
              </TextField>
              <TextField
                className="w-40"
                size="small"
                id="user-dropdown"
                select
                label="Channel"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {distChannelSelection?.length > 0 ? (
                  distChannelSelection.map((item, index) => {
                    return (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    );
                  })
                ) : (
                  <MenuItem value="">Loading...</MenuItem>
                )}
              </TextField>

              <TextField
                className="w-40"
                size="small"
                select
                label="Doc Status"
                value={docStatus}
                onChange={(e) => setDocStatus(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {statusSelection?.length > 0 ? (
                  statusSelection.map((item, index) => {
                    return (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    );
                  })
                ) : (
                  <MenuItem value="">Loading...</MenuItem>
                )}
              </TextField>

              <TextField
                className="w-40"
                size="small"
                select
                label="Doc Type"
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="new">New Customer</MenuItem>
                <MenuItem value="change">Change Customer</MenuItem>
              </TextField>

              <MyDatePicker
                className={"w-48"}
                label={"Create Doc Date"}
                name="createDate"
                value={
                  createDate?.includes(".")
                    ? formatBirth(createDate)
                    : dayjs(createDate)
                }
                onChange={(date) =>
                  setCreateDate(dayjs(date).format("YYYY-MM-DD"))
                }
              />
            </div>
            <div className="flex-wrap items-center  w-3/12flex">
              {needUpdateButton && (
                <Button
                  className="w-auto font-semibold"
                  style={{
                    marginRight: "1rem",
                  }}
                  color="success"
                  onClick={() => onClickUpdate()}
                  variant="contained"
                  title="Update may take time to complete..."
                >
                  Update
                  <UpdateIcon sx={{ marginLeft: "5px" }} />
                </Button>
              )}
              <Button
                className="w-auto font-semibold"
                style={{
                  marginRight: "1rem",
                }}
                color="info"
                onClick={() => clearFilter()}
                variant="outlined"
              >
                Clear Filter
              </Button>
              {createButton && (
                <Button
                  className="w-48"
                  style={{ color: "#FFFFFF", background: "#5ae4a7" }}
                  variant="contained"
                  onClick={handleClickCreateButton}
                >
                  Create
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
