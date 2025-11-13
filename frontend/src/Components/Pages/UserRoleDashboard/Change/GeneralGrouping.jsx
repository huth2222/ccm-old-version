import React, { useEffect, useState } from "react";
import Name from "./Name";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import Address from "./Address";
import BillingAddressInfo from "./BillingAddressInfo";
import InputText from "../../../CommonComponent/InputText";
import { changeUserStore } from "../../../../Store/changeUserStore";
import { useNavigate, useParams } from "react-router-dom";
import {
  areAllValuesEmpty,
  areAllValuesFalse,
} from "../../../../Utility/Constant";
import SalesDOAInfo from "./SalesDOAInfo";
import { userDashboardStore } from "../../../../Store/jobDashboard";
import dayjs from "dayjs";
import {
  putAxiosCall,
  putAxiosCallWthDataTypeJson,
} from "../../../../Utility/HelperFunction";
import { validateObjectFields } from "../../../../Utility/Constant";
import ChangePassCommentPopup from "./ChangePassCommentPopup";
import ChangeRejectReasonPopUP from "./ChangeRejectReasonPopUP";
import ChangeApprovalPopUp from "./ChangeApprovalPopUp";
import UploadSampleChange from "../CreateUser/UploadSampleChange";
import { useUploadItemStore } from "../../../../Store/createUserStore";
import AlertDialog from "../../../CommonComponent/AlertDialog";
import { toast } from "react-toastify";

export default function GeneralGrouping({ setCurrentIndex, userSaveJobId }) {
  const toastSuccessClasses = {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };
  const toastClasses = {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };
  const navigate = useNavigate();
  const { action, jobId } = useParams();
  const userrole = localStorage.getItem("role");
  const userData = localStorage.getItem("userData");
  const userParsedData = userData ? JSON.parse(userData) : {};
  const changeSelectedData = changeUserStore(
    (state) => state.selectedChangeOption
  );
  const changeCustomerData = userDashboardStore(
    (state) => state?.changeCustomerData
  );
  const isJobLoaded = userDashboardStore((state) => state.isJobLoaded);
  const getJobData = userDashboardStore((state) => state.job);
  const getVerifyObjFromStore = changeUserStore(
    (state) => state.verifyObjChange
  );
  const getChannelCode = localStorage.getItem("channel");

  const { name, telephoneNo, address, email, billingAddress } =
    changeSelectedData;
  const { creditLimit, paymentTerm, priceList } = changeSelectedData;

  const updateLocalName = [
    changeCustomerData?.NAME1,
    changeCustomerData?.NAME2,
    changeCustomerData?.NAME3,
    changeCustomerData?.NAME4,
  ];

  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openPopup, setOpenPopup] = React.useState(false);

  const [international, setInternational] = useState({
    name: "same",
    address: "same",
  });

  const extractedLocalName =
    isJobLoaded && updateLocalName
      ? updateLocalName?.filter(
        (value) => value !== "" && value !== null && value !== undefined
      )
      : [""];

  const [namesList, setNameList] = useState([""]);
  const [intnlNameList, setIntnlNameList] = useState([""]);
  const [localAddress, setLocalAddress] = useState({});
  const [intnlAddress, setIntnlAddress] = useState({});
  const [billingData, setBillingData] = useState({});
  const [salesDOAdata, setSalesDOAdata] = useState({});
  const [doaData, setdoaData] = useState(
    getChannelCode === "30" && JSON.parse(userData)?.companyCode === "1100"
      ? { "Div Head": "Vp113006" }
      : {}
  );

  const [updateAddress, setupdateAddress] = useState({});
  const [updateIntnlAddress, setupdateIntnlAddress] = useState({});
  const [updateBillingAddress, setupdateBillingAddress] = useState({});
  const [jobChangeList, setjobChangeList] = useState([]);
  const [jobVerifyData, setJobVerifyData] = useState({});
  const uploadStore = useUploadItemStore((state) => state.uploadItems);

  useEffect(() => {
    isJobLoaded && setNameList(extractedLocalName);
  }, [isJobLoaded]);

  const [userEmail, setUserEmail] = useState("");

  const [telephoneData, setTelephoneData] = useState({
    telephone: "",
    extension: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInternational({
      ...international,
      [name]: value,
    });
  };

  const handleEmail = (e) => {
    setUserEmail(e.target.value);
  };

  const trueKeys = Object.entries(changeSelectedData)
    .filter(([key, value]) => value === true)
    .map(([key]) => key);

  const handleTelephoneChange = (e) => {
    const { name, value } = e.target;
    setTelephoneData({
      ...telephoneData,
      [name]: value,
    });
  };

  const handleInputChange = (name, newData) => {
    if (name === "local") {
      setNameList(newData);
    } else {
      setIntnlNameList(newData);
    }
  };

  const isFilledArray = (array) => array.some((element) => element !== "");

  const isValidBillingData = () => {
    const excluedFields = [
      "subDistrict",
      "district",
      "street",
      "country",
      "countryCode",
      "name",
    ];
    const isValidBillingData =
      validateObjectFields(billingData, excluedFields) &&
        isFilledArray(billingData?.name ? billingData.name : [])
        ? true
        : false;
    return isValidBillingData;
  };

  const isAddressValid = () => {
    const excluedFields = ["subDistrict", "district", "street"];
    if (international.address === "same") {
      return validateObjectFields(localAddress, excluedFields);
    } else {
      return validateObjectFields(localAddress, excluedFields) &&
        validateObjectFields(intnlAddress, excluedFields)
        ? true
        : false;
    }
  };

  const isNameValid = () => {
    if (international.name === "same") {
      return isFilledArray(namesList);
    } else {
      return isFilledArray(namesList) && isFilledArray(intnlNameList)
        ? true
        : false;
    }
  };

  const isAllFeildValid = () => {
    const checkValidation = {
      name: isNameValid(),
      address: isAddressValid(),
      billingAddress: isValidBillingData(),
      telephoneNo: telephoneData?.telephone ? true : false,
      email: userEmail ? true : false,
      creditLimit: salesDOAdata?.creditLimit ? true : false,
      paymentTerm: salesDOAdata?.paymentTerm ? true : false,
      priceList: salesDOAdata?.priceList ? true : false,
    };

    const selectedKeys = Object.entries(changeSelectedData)
      .filter(([key, value]) => value === true)
      .map(([key]) => key);
    for (const objectName of selectedKeys) {
      if (!checkValidation[objectName]) {
        return false;
      }
    }
    return true;
  };

  const handleCloseApprovalPopup = () => {
    setOpenPopup(false);
  };
  const handleCoApprovalPopup = () => {
    setIsSubmit(true);
    isAllFeildValid() && setOpenPopup(true);
  };

  function areAllKeysEmpty(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key]) {
        return false;
      }
    }
    return true;
  }

  const payload = {
    data: {
      jobChange: trueKeys.length > 0 ? trueKeys : jobChangeList,
      generalInfomation: {
        originalGeneral: {
          name: namesList,
          email: userEmail,
          ...localAddress,
          ...telephoneData,
        },
        internationalVersionChoose: international.name,
        internationalGeneral:
          international.name === "differenceAddress" ||
            international.address === "differenceAddress"
            ? {
              name: intnlNameList,
              ...intnlAddress,
            }
            : {},
      },
      saleInfomation: { ...salesDOAdata },
      billingAddress: billingData,
      verify: areAllKeysEmpty(getVerifyObjFromStore)
        ? jobVerifyData
        : getVerifyObjFromStore,
      ...doaData,
    },
  };

  const saveData = async () => {
    let payloadData = {
      ...payload,
      uploadItems: uploadStore,
    };
    setIsLoading(true);
    const url = `job/submitDraftJob/${userSaveJobId}`;
    const sendRequest = await putAxiosCall(url, payloadData);

    if (sendRequest.status === 200) {
      setIsLoading(false);
      navigate("/user");
    } else {
      setIsLoading(false);
    }
  };

  const checkConditionDOA = () => {
    try {
      if (JSON.parse(userData)?.companyCode === "1100") {
        if (
          getChannelCode === "20" ||
          getChannelCode === "30" ||
          getChannelCode === "40" ||
          getChannelCode === "50" ||
          getChannelCode === "60"
        ) {
          if (
            doaData?.["Div Head"] === undefined ||
            payload?.data?.["Div Head"]?.length < 1
          ) {
            return false;
          } else {
            return true;
          }
        } else {
          if (
            doaData?.["Div Head"] === undefined ||
            doaData?.["SGH"] === undefined ||
            payload?.data?.["Div Head"]?.length < 1 ||
            payload?.data?.["SGH"]?.length < 1
          ) {
            return false;
          } else {
            return true;
          }
        }
      } else if (JSON.parse(userData)?.companyCode === "1200") {
        if (
          salesDOAdata?.priceList === "S" ||
          salesDOAdata?.priceList === "M" ||
          salesDOAdata?.priceList === "L"
        ) {
          if (getChannelCode === "10" || getChannelCode === "20") {
            if (
              doaData?.["SGH"] === undefined ||
              payload?.data?.["SGH"]?.length < 1
            ) {
              return false;
            } else {
              return true;
            }
          } else if (
            getChannelCode === "30" ||
            getChannelCode === "40" ||
            getChannelCode === "50" ||
            getChannelCode === "60"
          ) {
            return true;
          }
        } else {
          if (getChannelCode === "10" || getChannelCode === "20") {
            if (
              doaData?.["Div Head"] === undefined ||
              doaData?.["SGH"] === undefined ||
              payload?.data?.["Div Head"]?.length < 1 ||
              payload?.data?.["SGH"]?.length < 1
            ) {
              return false;
            } else {
              return true;
            }
          } else if (
            getChannelCode === "30" ||
            getChannelCode === "40" ||
            getChannelCode === "50" ||
            getChannelCode === "60"
          ) {
            if (
              doaData?.["Div Head"] === undefined ||
              payload?.data?.["Div Head"]?.length < 1
            ) {
              return false;
            } else {
              return true;
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitForm = async () => {
    if (checkConditionDOA()) {
      const url = `job/submitSaveJob/${userSaveJobId}`;
      setIsSubmit(true);
      setIsLoading(true);
      let payloadData = {
        ...payload,
        uploadItems: uploadStore,
      };
      const sendRequest = await putAxiosCall(url, payloadData);
      if (sendRequest.status === 200) {
        setIsSubmit(false);
        setIsLoading(false);
        setCurrentIndex(1);
      } else {
        setIsSubmit(false);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (
      action !== "edit" &&
      action !== "view" &&
      action !== "status" &&
      areAllValuesFalse(changeSelectedData)
    ) {
      navigate("/createuser/addinfo");
    }
  }, []);

  const [open, setOpen] = useState(false);
  const [opendialog, setOpenDialog] = useState(false);
  const [rejectText, setRejectText] = useState("");
  const handleClickOpen = (title) => {
    setOpen(true);
    setRejectText(title);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseDialog = () => {
    try {
      setOpenDialog(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendDialog = async () => {
    try {
      const resData = await putAxiosCallWthDataTypeJson(
        `job/submitCloseJob/${jobId}`
      );
      if (resData?.data?.message === "Update Success.") {
        toast.success(resData?.data?.message, toastSuccessClasses);
        navigate("/user");
      } else {
        toast.error("Error. Please try again.", toastClasses);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [openPopupPass, setOpenPopupPass] = useState(false);

  const handleClickOpenCancel = () => {
    setOpenPopupPass(true);
  };

  function handleClosePopup() {
    setOpenPopupPass(false);
  }

  // EDIT FLOW Data Handling

  function removeObjKey(obj, keyToRemove) {
    const { [keyToRemove]: removedKey, ...newObj } = obj;
    return newObj;
  }

  useEffect(() => {
    if (action && action !== "add" && Object.entries(getJobData).length > 0) {
      const nameList = getJobData?.generalInfomation?.originalGeneral?.name;
      setNameList(nameList);
      const email = getJobData?.generalInfomation?.originalGeneral?.email;
      setUserEmail(email);
      const telephone =
        getJobData?.generalInfomation?.originalGeneral?.telephone;
      const extension =
        getJobData?.generalInfomation?.originalGeneral?.extension;
      setTelephoneData({ ...telephoneData, telephone, extension });
      const internationalVersionName =
        getJobData?.generalInfomation?.internationalVersionChoose;
      const intnlNameList =
        getJobData?.generalInfomation?.internationalGeneral?.name;
      setIntnlNameList(intnlNameList);
      setInternational({
        ...international,
        name:
          internationalVersionName !== "same" && intnlNameList?.length > 0
            ? "differenceAddress"
            : "same",
        address:
          internationalVersionName !== "same" &&
            getJobData?.generalInfomation?.internationalGeneral?.postalCode
            ? "differenceAddress"
            : "same",
      });
      const addressObj = getJobData?.generalInfomation?.originalGeneral;
      const intnlAddressObj =
        getJobData?.generalInfomation?.internationalGeneral;
      addressObj && setupdateAddress(removeObjKey(addressObj, "name"));
      intnlAddressObj &&
        setupdateIntnlAddress(removeObjKey(intnlAddressObj, "name"));
      const billingAddObj = getJobData?.billingAddress;
      setupdateBillingAddress(billingAddObj);
      const jobData = getJobData?.jobChange;
      jobData && setjobChangeList(jobData);
      getJobData?.verify && setJobVerifyData(getJobData?.verify);
    }
  }, [getJobData]);

  // console.log(getJobData, {
  // billingData,
  //   updateAddress,
  //   updateIntnlAddress,
  //   updateBillingAddress,
  // });

  // console.log({
  //   localAddress,
  //   intnlAddress,
  //   billingData,
  //   salesDOAdata,
  //   telephoneData,
  //   changeCustomerData,
  //   namesList,
  //   intnlNameList,
  // });

  return (
    <div>
      <div className="flex justify-around lg:mx-10 xs:my-8 lg:my-8 ">
        <div className="w-4/12 lg:pl-42">
          <p className="mb-4 subpixel-antialiased font-semibold text-green lg:text-3xl">
            General Information
          </p>
          <p className="text-lg pl-9 text-blue">
            Doc Date - {dayjs(getJobData?.createDate).format("DD/MM/YYYY")}
          </p>
          {getJobData?.jobNumber?.length > 0 && (
            <p className="text-lg pl-9 text-blue">
              Document ID : {getJobData?.jobNumber}
            </p>
          )}
          {getJobData?.verify?.customerId?.length > 0 && (
            <p className="text-lg pl-9 text-blue">
              Customer ID : {getJobData?.verify?.customerId}
            </p>
          )}
          {changeCustomerData?.NAME1?.length > 0 && (
            <p className="text-lg pl-9 text-blue">
              Customer Name : {changeCustomerData?.NAME1}
            </p>
          )}
        </div>
        <div className="w-2/5">
          <p className="mb-4 "> Please fill the information.</p>
          {(name || jobChangeList.includes("name")) && (
            <>
              <p className="mt-4 mb-4 text-xl">Name</p>
              <Name
                name={"local"}
                isSubmit={isSubmit}
                inputData={namesList}
                onDataChange={handleInputChange}
                getJobData={getJobData}
              />

              <FormControl component="fieldset">
                <FormLabel className="mt-8" style={{ color: "red" }}>
                  International Version Name.
                </FormLabel>
                <RadioGroup
                  name="name"
                  row
                  className="mb-4"
                  value={international.name}
                  onChange={(e) => handleChange(e)}
                >
                  <FormControlLabel
                    value="same"
                    control={<Radio color="success" />}
                    label="Same"
                    disabled={
                      userrole === "AR Master"
                        ? getJobData?.isArMasterApproved
                        : action === "view" || action === "status"
                          ? true
                          : false
                    }
                  />
                  <FormControlLabel
                    value="differenceAddress"
                    control={<Radio color="success" />}
                    label="Change"
                    disabled={
                      userrole === "AR Master"
                        ? getJobData?.isArMasterApproved
                        : action === "view" || action === "status"
                          ? true
                          : false
                    }
                  />
                </RadioGroup>
              </FormControl>
              {international.name !== "same" && (
                <Name
                  name={"Intnl"}
                  isSubmit={isSubmit}
                  inputData={intnlNameList}
                  onDataChange={handleInputChange}
                  getJobData={getJobData}
                />
              )}
            </>
          )}
          {(address || jobChangeList.includes("address")) && (
            <>
              <p className="mt-8 mb-4 text-xl">Address.</p>
              <Address
                isSubmit={isSubmit}
                setAddress={setLocalAddress}
                localAddress={localAddress}
                version={"local"}
                updateAddress={updateAddress}
                getJobData={getJobData}
              />
              <FormControl component="fieldset">
                <FormLabel className="mt-8" style={{ color: "red" }}>
                  International Version Address.
                </FormLabel>
                <RadioGroup
                  name="address"
                  row
                  className="mb-4"
                  value={international.address}
                  onChange={(e) => handleChange(e)}
                >
                  <FormControlLabel
                    value="same"
                    control={<Radio color="success" />}
                    label="Same"
                    disabled={
                      userrole === "AR Master"
                        ? getJobData?.isArMasterApproved
                        : action === "view" || action === "status"
                          ? true
                          : false
                    }
                  />
                  <FormControlLabel
                    value="differenceAddress"
                    control={<Radio color="success" />}
                    label="Change"
                    disabled={
                      userrole === "AR Master"
                        ? getJobData?.isArMasterApproved
                        : action === "view" || action === "status"
                          ? true
                          : false
                    }
                  />
                </RadioGroup>
              </FormControl>
              {international.address !== "same" && (
                <Address
                  version={"intnl"}
                  setIntnlAddress={setIntnlAddress}
                  intnlAddress={intnlAddress}
                  isSubmit={isSubmit}
                  updateAddress={updateIntnlAddress}
                  getJobData={getJobData}
                />
              )}
            </>
          )}
          {(billingAddress || jobChangeList.includes("billingAddress")) && (
            getJobData.jobType !== "changeCustomer" ? (
              international.address !== "same" && (
                <BillingAddressInfo
                  setBillingAddressData={setBillingData}
                  isSubmit={isSubmit}
                  updateBillingAddress={updateBillingAddress}
                  getJobData={getJobData}
                />
              )
            ) : (
              <BillingAddressInfo
                setBillingAddressData={setBillingData}
                isSubmit={isSubmit}
                updateBillingAddress={updateBillingAddress}
                getJobData={getJobData}
              />
            )
          )}
          {(telephoneNo || jobChangeList.includes("telephoneNo")) && (
            <>
              <p className="mt-4 mb-4 text-xl">MobilePhone Number</p>
              <InputText
                className="w-full p-8"
                name="telephone"
                label="Mobile Number"
                value={telephoneData.telephone}
                onChange={(e) => handleTelephoneChange(e)}
                wordLength={12}
                error={isSubmit && !telephoneData.telephone ? true : false}
                disabled={
                  userrole === "AR Master"
                    ? getJobData?.isArMasterApproved
                    : action === "view" || action === "status"
                      ? true
                      : false
                }
              />
            </>
          )}
          {(email || jobChangeList.includes("email")) && (
            <>
              <p className="mt-4 mb-4 text-xl">Email.</p>
              <InputText
                className="w-full p-8"
                name="email"
                label="Email"
                value={userEmail}
                wordLength={240}
                onChange={(e) => handleEmail(e)}
                error={isSubmit && !userEmail ? true : false}
                disabled={
                  userrole === "AR Master"
                    ? getJobData?.isArMasterApproved
                    : action === "view" || action === "status"
                      ? true
                      : false
                }
              />
            </>
          )}
        </div>
      </div>
      {(!areAllValuesEmpty({ creditLimit, paymentTerm, priceList }) ||
        jobChangeList.includes("creditLimit") ||
        jobChangeList.includes("paymentTerm") ||
        jobChangeList.includes("priceList")) && (
          <SalesDOAInfo
            changeSelectedData={changeSelectedData}
            setCurrentIndex={setCurrentIndex}
            setSalesDOAdata={setSalesDOAdata}
            isSubmit={isSubmit}
            jobChangeList={jobChangeList}
          />
        )}
      {(name ||
        jobChangeList.includes("name") ||
        address ||
        jobChangeList.includes("address") ||
        billingAddress ||
        jobChangeList.includes("billingAddress") ||
        !areAllValuesEmpty({ creditLimit, paymentTerm, priceList }) ||
        jobChangeList.includes("creditLimit") ||
        jobChangeList.includes("paymentTerm") ||
        jobChangeList.includes("priceList")) && <UploadSampleChange />}
      <div className="h-36 mr-36">
        <div
          className="flex justify-end w-full mt-8 mb-8"
          style={{ marginBottom: "6rem" }}
        >
          {action === "view" ? (
            <>
              <Button
                sx={{
                  marginRight: "14px",
                  color: "black",
                  border: "1px solid black",
                }}
                variant="outlined"
                size="medium"
                onClick={() =>
                  handleClickOpen("Cancel/Back to Requestor Topics")
                }
              >
                CENCEL
              </Button>
              <Button
                variant="contained"
                size="medium"
                sx={{ background: "gray", marginRight: "14px" }}
                onClick={() => handleClickOpen("Back To Requestor Topics.")}
              >
                Back To Requester
              </Button>
              <Button
                variant="contained"
                size="medium"
                style={{ color: "#FFFFFF", background: "#5ae4a7" }}
                onClick={() => setOpenPopupPass(true)}
              >
                PASS
              </Button>
            </>
          ) : action === "status" ? (
            <>
              {getJobData?.jobType === "changeCustomer" &&
                getJobData?.isApproved === true &&
                getJobData?.isArMasterApproved === true &&
                getJobData?.status[getJobData?.requesterEmployeeId] !==
                "Completed" && (
                  <Button
                    variant="contained"
                    size="medium"
                    sx={{
                      color: "#FFFFFF",
                      background: "#5ae4a7",
                      marginRight: "14px",
                    }}
                    onClick={() => setOpenDialog(true)}
                  >
                    Close Work Sheet
                  </Button>
                )}
              <Button
                variant="contained"
                size="medium"
                sx={{ background: "gray", marginRight: "14px" }}
                onClick={() => navigate("/user")}
              >
                Back To Dashboard
              </Button>
            </>
          ) : (
            <>
              <Button
                sx={{
                  marginRight: "14px",
                  color: "black",
                  border: "1px solid black",
                }}
                variant="outlined"
                size="medium"
                onClick={() => navigate("/createuser/addinfo")}
              >
                Back
              </Button>
              <Button
                variant="contained"
                size="medium"
                sx={{ background: "gray", marginRight: "14px" }}
                onClick={() => saveData()}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Save"}
              </Button>
              <Button
                variant="contained"
                size="medium"
                style={{ color: "#FFFFFF", background: "#5ae4a7" }}
                onClick={() => handleCoApprovalPopup()}
              >
                SUBMIT
              </Button>
            </>
          )}
        </div>
      </div>
      <ChangeApprovalPopUp
        handleClosePopup={handleCloseApprovalPopup}
        open={openPopup}
        handleSubmit={submitForm}
        BoxTitle={"Please Select Approval"}
        setdoaData={setdoaData}
        doaData={doaData}
        isDataSubmited={isLoading}
        salesDOAdata={salesDOAdata}
      />
      <ChangeRejectReasonPopUP
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
        open={open}
        rejectTitle={rejectText}
        userId={jobId}
      />
      <ChangePassCommentPopup
        handleClickOpen={handleClickOpenCancel}
        handleClosePopup={handleClosePopup}
        open={openPopupPass}
        payload={payload}
        BoxTitle={"Comment and Confirm"}
        coApprovalCheckbox={
          userrole === "AR Master" && userParsedData.userType === "AR"
            ? true
            : false
        }
        setCurrentIndex={setCurrentIndex}
      />
      <AlertDialog
        handleClose={handleCloseDialog}
        open={opendialog}
        handleSend={handleSendDialog}
      />
    </div>
  );
}
