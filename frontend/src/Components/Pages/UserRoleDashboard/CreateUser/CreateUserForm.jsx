import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import NavHeaderDashboard from "../../../CommonComponent/NavHeaderDashboard";
import DataGridTable from "../../../CommonComponent/DataGridTable";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  postAxiosCall,
  getAxiosCall,
} from "../../../../Utility/HelperFunction";
import dayjs from "dayjs";
import { useVerifyStore } from "../../../../Store/createUserStore";
import { convertToFiveDigitFormat } from "../../../../Utility/Constant";
import TOADropdown from "../../../CommonComponent/TOADropdown";
import Verify from "../Change/Verify";
import InputText from "../../../CommonComponent/InputText";
import { toast } from "react-toastify";

export default function CreateUserForm({ setCurrentIndex, setVerifyDataObj }) {
  const toastClasses = {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };
  const userData = localStorage.getItem("userData");
  const userParsedData = userData ? JSON.parse(userData) : {};
  const menuList = [
    { name: "Open new customer", value: "newCustomer" },
    { name: "Change customer info.", value: "changeCustomer" },
  ];
  const navigate = useNavigate();
  const date = new Date();
  const user = localStorage.getItem("userData");
  const parsedUser = JSON.parse(user);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isRequestSend, setIsRequestSend] = useState(false);
  //   console.log(parsedUser);
  const stateVerifyData = useVerifyStore((state) => state.verify);
  const updateVerifyStore = useVerifyStore(
    (state) => state.updateVerifyDataState
  );
  const [dataCustomer, setDataCustomer] = useState([]);

  const [userDataCollection, setUserDataCollection] = useState({
    jobType: "newCustomer",
    officeType: "headOffice",
    taxId: "",
    branchCode: "00000",
    companyCode: parsedUser.companyCode,
    // channel: parsedUser.distChannel,
    channel: "",
    buyingGroup: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "officeType") {
      if (value === "headOffice") {
        setUserDataCollection({
          ...userDataCollection,
          branchCode: "00000",
          [name]: value,
        });
      } else {
        const userDataUpdate = {
          ...userDataCollection,
          branchCode: "",
          [name]: value,
        };
        setUserDataCollection(userDataUpdate);
      }
    } else {
      const userDataUpdate = {
        ...userDataCollection,
        [name]: value,
      };

      setUserDataCollection(userDataUpdate);
    }
  };

  const handleNumber = (e) => {
    const { name, value } = e.target;
    const regex = /^[0-9\b]+$/;
    if (value === "" || regex.test(value)) {
      setUserDataCollection({
        ...userDataCollection,
        [name]: value,
      });
    }
  };

  const handleTaxId = (e) => {
    const { name, value } = e.target;
    const regex = /^[0-9!@#$%^&*()_+{}\[\]:;<>,.?~-]+$/;
    if (value === "" || regex.test(value)) {
      setUserDataCollection({
        ...userDataCollection,
        [name]: value,
      });
    }
  };

  const handleBlur = () => {
    const data = convertToFiveDigitFormat(userDataCollection.branchCode);
    setUserDataCollection({
      ...userDataCollection,
      branchCode: data,
    });
  };

  const isAllFieldValid = () => {
    const { taxId, branchCode } = userDataCollection;

    return taxId && branchCode ? true : false;
  };
  const payloadData = {
    ...userDataCollection,
    branchCode: convertToFiveDigitFormat(userDataCollection.branchCode),
  };

  const verifyUserData = async () => {
    setIsSubmit(true);
    if (isAllFieldValid()) {
      const sendRequest = await postAxiosCall(
        "customers/verifyData",
        payloadData
      );
      if (sendRequest !== "error") {
        localStorage.setItem("channel", userDataCollection.channel);
        setVerifyDataObj(payloadData);
        setCurrentIndex((prev) => prev + 1);
        updateVerifyStore(payloadData);
        setIsRequestSend(false);
      } else {
        setIsRequestSend(false);
      }
    }
  };

  const CheckTaxID = async () => {
    try {
      // check taxId ซ้ำ
      const { taxId, branchCode } = userDataCollection;
      const resData = await getAxiosCall(
        `job/verifyTaxIDAndBranch/${taxId}/${branchCode}`
      );
      if (resData?.data?.data?.length > 0) {
        setDataCustomer(resData?.data?.data);
      } else {
        setDataCustomer([]);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (
      userDataCollection.taxId?.length > 0 &&
      userDataCollection.branchCode?.length > 0
    ) {
      CheckTaxID();
    }
  }, [userDataCollection.taxId, userDataCollection.branchCode]);

  const columns = [
    { field: "Customer", headerName: "Code", width: 90 },
    { field: "NAME1", headerName: "Customer Name", width: 225 },
    { field: "CompanyCode", headerName: "Company", width: 85 },
    { field: "BranchCode", headerName: "Branch", width: 70 },
    { field: "SalesOff", headerName: "Sales Office", width: 100 },
    // { field: "SalesOffDesc", headerName: "Sales Office Desc", width: 140 },
  ];

  const rows =
    dataCustomer?.length > 0
      ? dataCustomer?.map((item) => {
          return { ...item, id: item._id };
        })
      : [];

  return (
    <div>
      <div className="flex justify-around lg:mx-10 xs:my-8 lg:my-8 ">
        <div className="w-4/12 lg:pl-48">
          <p className="mb-4 subpixel-antialiased font-semibold text-green lg:text-2xl">
            1. Select Job Type
          </p>
          <p className="text-lg pl-9">
            Doc Date: {dayjs().format("DD/MM/YYYY : h.mm")}
          </p>
          {/* <p className="text-lg pl-9">Document ID</p> */}
          {/* <div></div> */}
        </div>
        <div className="w-2/5">
          <p className="mb-4 ">Please Select the job task</p>
          <TextField
            className="w-full"
            size="small"
            id="user-dropdown"
            select
            label="Select Customer Type"
            name="jobType"
            value={userDataCollection.jobType}
            onChange={handleChange}
          >
            {menuList.map((item) => {
              return (
                <MenuItem key={item.value} value={item.value}>
                  {item.name}
                </MenuItem>
              );
            })}
          </TextField>
        </div>
      </div>
      {userDataCollection.jobType === "changeCustomer" ? (
        <Verify />
      ) : (
        <div className="flex justify-around lg:mx-10 xs:my-8 lg:my-8">
          <div className="w-4/12 lg:pl-48">
            <p className="subpixel-antialiased font-semibold text-green lg:text-3xl">
              2. Verify Step
            </p>
          </div>
          <div className="w-2/5">
            <p className="mb-4">Please fill in the information</p>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="officeType"
                name="officeType"
                row
                aria-labelledby="branch-row-radio-buttons-group-label"
                className="mb-4"
                value={userDataCollection.officeType}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="headOffice"
                  control={<Radio color="success" />}
                  label="Head Office"
                />
                {parsedUser.companyCode !== "5100" && (
                  <FormControlLabel
                    value="branch"
                    control={<Radio color="success" />}
                    label="Branch"
                  />
                )}
              </RadioGroup>
            </FormControl>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <InputText
                className="p-8"
                required
                name="taxId"
                label="Tax ID"
                value={userDataCollection.taxId}
                onChange={(e) => handleTaxId(e)}
                error={isSubmit && !userDataCollection.taxId ? true : false}
                wordLength={20}
              />
              {parsedUser.companyCode !== "5100" && (
                <InputText
                  className="p-8"
                  required
                  name="branchCode"
                  label="Branch Code"
                  value={userDataCollection.branchCode}
                  onChange={(e) => handleNumber(e)}
                  error={
                    isSubmit && !userDataCollection.branchCode ? true : false
                  }
                  wordLength={5}
                  disabled={
                    userDataCollection.officeType === "headOffice"
                      ? true
                      : false
                  }
                  onBlur={handleBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#000000",
                      cursor: "not-allowed",
                    },
                  }}
                />
              )}

              <InputText
                className="p-8 "
                required
                name="companyCode"
                label="Company Code"
                disabled={true}
                value={userDataCollection.companyCode}
                error={
                  isSubmit && !userDataCollection.companyCode ? true : false
                }
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "#000000",
                    cursor: "not-allowed",
                  },
                }}
              />
              <TOADropdown
                dataList={userParsedData?.distChannel}
                label="Channel"
                name="channel"
                value={userDataCollection.channel}
                onChange={(e) => handleNumber(e)}
                dataArrayOfObject={false}
                error={isSubmit && !userDataCollection.channel ? true : false}
              />
            </div>
            <InputText
              className="w-full p-8"
              name="buyingGroup"
              label="Buying Group"
              value={userDataCollection.buyingGroup}
              onChange={(e) => handleNumber(e)}
              // error={isSubmit && !userDataCollection.buyingGroup ? true : false}
              wordLength={10}
            />
            {dataCustomer?.length > 0 && (
              <DataGridTable
                className="mt-5"
                rows={rows}
                columns={columns}
                checkboxSelection={false}
                exportNotNeed={true}
              />
            )}
            <div className="flex justify-center w-full mt-6">
              <Button
                style={{
                  marginRight: "14px",
                  color: "black",
                  border: "1px solid black",
                }}
                variant="outlined"
                size="medium"
                onClick={() => navigate("/user")}
              >
                CANCEL
              </Button>
              <Button
                variant="contained"
                size="medium"
                // disabled={isRequestSend ? true : false}
                style={{ color: "#FFFFFF", background: "#5ae4a7" }}
                disabled={isRequestSend ? true : false}
                onClick={verifyUserData}
              >
                {isRequestSend ? "Loading..." : "VERIFY"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
