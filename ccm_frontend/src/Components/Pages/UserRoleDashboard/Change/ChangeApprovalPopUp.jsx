import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
// import TOADropdown from "./TOADropdown";
import { memo } from "react";
import {
  getAxiosCall,
  reorderObjectKeys,
} from "../../../../Utility/HelperFunction";
import TOADropdown from "../../../CommonComponent/TOADropdown";

function ChangeApprovalPopUp({
  handleClosePopup,
  open,
  BoxTitle,
  doaData,
  setdoaData,
  isDataSubmited,
  handleSubmit,
  salesDOAdata,
}) {
  const userData = localStorage.getItem("userData");
  const userParsedData = userData ? JSON.parse(userData) : {};
  const getChannelCode = localStorage.getItem("channel");

  const handleOutsideClickClose = (event, reason) => {
    if (reason && reason == "backdropClick" && "escapeKeyDown") return;
    handleClosePopup();
  };

  const handleBack = () => {
    if (
      getChannelCode === "30" &&
      JSON.parse(userData)?.companyCode === "1100"
    ) {
      setdoaData({ "Div Head": "Vp113006" });
    } else {
      setdoaData({});
    }
    handleClosePopup();
  };
  const [channel, setChannel] = React.useState(getChannelCode);
  const handleDOADropdown = (e) => {
    const { name, value } = e.target;
    const copiedData = {
      ...doaData,
      [name]: value,
    };
    setdoaData(copiedData);
  };

  const handleChannel = (e) => {
    const { name, value } = e.target;
    if (name === "channel") {
      setChannel(value);
    }
  };

  const [doa, setDoa] = React.useState([]);
  const [userDoaData, setUserDoaData] = React.useState([]);

  const handleConfirm = async (channelCode) => {
    if (channelCode !== undefined && channelCode !== "") {
      // channel === undefined && alert("channel undefined");
      const sendRequest = await getAxiosCall(
        `data/userDOAdataSet/${channelCode}`
      );
      if (sendRequest.status === 200) {
        const doa = sendRequest.data.data.doa;
        const userDoaList = sendRequest.data.data.userDOAData;
        const orderedDOA = reorderObjectKeys(userDoaList, doa);

        setDoa(doa);
        // setUserDoaData(Object.entries(userDoaList));
        setUserDoaData(Object.entries(orderedDOA));
      }
    }
  };

  React.useEffect(() => {
    getChannelCode && handleConfirm(getChannelCode);
  }, [getChannelCode]);

  const getDataDOA = async () => {
    try {
      // set doa by company
      if (JSON.parse(userData)?.companyCode === "1100") {
        if (
          (salesDOAdata?.priceList === "S" ||
            salesDOAdata?.priceList === "M" ||
            salesDOAdata?.priceList === "L") &&
          (getChannelCode === "20" ||
            getChannelCode === "30" ||
            getChannelCode === "40" ||
            getChannelCode === "50" ||
            getChannelCode === "60")
        ) {
          const sendRequest = await getAxiosCall(
            `data/userDOAdataSet/${getChannelCode}`
          );
          if (sendRequest?.status === 200) {
            const keyOrder = [];
            let userDoaList = sendRequest?.data?.data?.userDOAData;
            delete userDoaList["Div Head"];
            const orderedDOA = reorderObjectKeys(userDoaList, keyOrder);
            setDoa(keyOrder);
            setUserDoaData(Object.entries(orderedDOA));
          }
        } else {
          const sendRequest = await getAxiosCall(
            `data/userDOAdataSet/${getChannelCode}`
          );
          if (sendRequest.status === 200) {
            const doa = sendRequest.data.data.doa;
            const keyOrder = doa;
            const userDoaList = sendRequest.data.data.userDOAData;
            const orderedDOA = reorderObjectKeys(userDoaList, keyOrder);
            setDoa(doa);
            setUserDoaData(Object.entries(orderedDOA));
          }
        }
      } else if (JSON.parse(userData)?.companyCode === "1200") {
        if (
          salesDOAdata?.paymentTerm === "CCOD" ||
          salesDOAdata?.paymentTerm === "CCDD" ||
          salesDOAdata?.priceList === "S" ||
          salesDOAdata?.priceList === "M" ||
          salesDOAdata?.priceList === "L"
        ) {
          if (getChannelCode === "10" || getChannelCode === "20") {
            const sendRequest = await getAxiosCall(
              `data/userDOAdataSet/${getChannelCode}`
            );
            if (sendRequest?.status === 200) {
              const keyOrder = ["SGH"];
              let userDoaList = sendRequest?.data?.data?.userDOAData;
              delete userDoaList["Div Head"];
              const orderedDOA = reorderObjectKeys(userDoaList, keyOrder);
              setDoa(keyOrder);
              setUserDoaData(Object.entries(orderedDOA));
            }
          } else if (
            getChannelCode === "30" ||
            getChannelCode === "40" ||
            getChannelCode === "50" ||
            getChannelCode === "60"
          ) {
            const sendRequest = await getAxiosCall(
              `data/userDOAdataSet/${getChannelCode}`
            );
            if (sendRequest?.status === 200) {
              const keyOrder = [];
              let userDoaList = sendRequest?.data?.data?.userDOAData;
              delete userDoaList["Div Head"];
              delete userDoaList["SGH"];
              const orderedDOA = reorderObjectKeys(userDoaList, keyOrder);
              setDoa(keyOrder);
              setUserDoaData(Object.entries(orderedDOA));
            }
          }
        } else {
          const sendRequest = await getAxiosCall(
            `data/userDOAdataSet/${getChannelCode}`
          );
          if (sendRequest.status === 200) {
            const doa = sendRequest.data.data.doa;
            const keyOrder = doa;
            const userDoaList = sendRequest.data.data.userDOAData;
            const orderedDOA = reorderObjectKeys(userDoaList, keyOrder);
            setDoa(doa);
            setUserDoaData(Object.entries(orderedDOA));
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getDataDOA();
  }, [salesDOAdata?.paymentTerm, salesDOAdata?.priceList]);

  return (
    <div>
      <Dialog open={open} onClose={handleOutsideClickClose}>
        <DialogTitle className="text-center">{BoxTitle}</DialogTitle>
        <DialogContent sx={{ width: "400px", padding: "1rem" }}>
          <TOADropdown
            className="w-full"
            dataList={userParsedData?.distChannel}
            label="Channel"
            name="channel"
            value={getChannelCode}
            onChange={(e) => handleChannel(e)}
            dataArrayOfObject={false}
            error={!channel ? true : false}
            disabled={getChannelCode ? true : false}
            needMargin={"10px"}
          />
        </DialogContent>
        {userDoaData.map((option, index) => {
          const checkUserChannel30 = option[1]?.filter(
            (x) =>
              x?.name === "ภาชญา ผ่องพิทักษ์กุล" && x?.distChannel[0] === "30"
          );
          return (
            <DialogContent key={index} sx={{ width: "400px", padding: "1rem" }}>
              <FormControl fullWidth>
                <InputLabel size="small">Position {option[0]}</InputLabel>
                {checkUserChannel30?.length > 0 ? (
                  <Select
                    name={option[0]}
                    size="small"
                    label={`Position ${option[0]}`}
                    onChange={handleDOADropdown}
                    value={checkUserChannel30[0]?.username}
                    defaultValue=""
                    disabled={true}
                  >
                    {option[1].map((item) => {
                      const displayText = `${item.doaTag} - ${item.name}`;
                      return (
                        <MenuItem
                          size="small"
                          key={item._id}
                          value={item.username}
                        >
                          {displayText}
                        </MenuItem>
                      );
                    })}
                  </Select>
                ) : (
                  <Select
                    name={option[0]}
                    size="small"
                    label={`Position ${option[0]}`}
                    onChange={handleDOADropdown}
                    defaultValue=""
                  >
                    {option[1].map((item) => (
                      <MenuItem
                        size="small"
                        key={item._id}
                        value={item.username}
                      >
                        {item.doaTag} - {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </FormControl>
            </DialogContent>
          );
        })}

        <DialogActions>
          <Button variant="outlined" size="medium" onClick={handleBack}>
            BACK
          </Button>
          <Button
            onClick={() => handleSubmit()}
            style={{ color: "#FFFFFF", background: "#5ae4a7" }}
            // disabled={
            //   Object.keys(doaData).length > 0 && !isDataSubmited ? false : true
            // }
            size="medium"
          >
            {isDataSubmited ? "Loading..." : "CONFIRM"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default memo(ChangeApprovalPopUp);
