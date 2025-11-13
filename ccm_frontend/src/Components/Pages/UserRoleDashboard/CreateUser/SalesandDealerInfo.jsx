import React, { useEffect, useState } from "react";
import ProgressBar from "../../../CommonComponent/ProgressBar";
import { Button } from "@mui/material";
import SalesInfo from "./SalesInfo";
import { AuthorizeDirector } from "./AuthorizeDirector";
import { BillingAddress } from "./BillingAddress";
import {
  useBillingStore,
  useSalesStore,
  useAuthorizeStore,
  useUploadItemStore,
  useGeneralInfoStore,
  useUserDataStore,
} from "../../../../Store/createUserStore";
import { putAxiosCall } from "../../../../Utility/HelperFunction";
import {
  validateObjectFields,
  validateObjectIncludes,
} from "../../../../Utility/Constant";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { userDashboardStore } from "../../../../Store/jobDashboard";
import ApprovalPopUp from "../../../CommonComponent/ApprovalPopUp";
// import { UploadSingleFile } from "./UploadSingleFile";
import UploadSample from "./UploadSample";
import { toast } from "react-toastify";

export function SalesandDealerInfo({ setCurrentIndex }) {
  const getChannelCode = localStorage.getItem("channel");
  let { jobId, action } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [updateIndex, setUpdateIndex] = useState(2);
  const isUserCameForEdit = location.pathname.includes("edituser");
  const [openPopup, setOpenPopup] = React.useState(false);

  const setSubmitTrueInStore = useUserDataStore(
    (state) => state.updateSubmitTrueState
  );
  const isSubmit = useUserDataStore((state) => state.isSubmited);
  const salesStore = useSalesStore((state) => state.saleInfomation);
  const authorizeStore = useAuthorizeStore((state) => state.authorizeDirector);
  const billingStoreData = useBillingStore((state) => state.billingAddress);
  const uploadStore = useUploadItemStore((state) => state.uploadItems);
  const userSaveJobId = useGeneralInfoStore((state) => state.id);
  const resetSavedPayloadInStore = useGeneralInfoStore(
    (state) => state.resetSavedPayloadStoreData
  );
  const [isDataSubmited, setIsDataSubmited] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  // console.log("authorizeStore", authorizeStore);

  // network call from store ==
  const fetchJob = userDashboardStore((state) => state.fetchJob);

  // Getdata From Store--**
  const getJobData = userDashboardStore((state) => state.job);
  const isJobDataLoadedFromAPI = userDashboardStore(
    (state) => state.isJobLoaded
  );

  const user = localStorage.getItem("userData");
  const parsedUserData = JSON.parse(user);

  const { employeeId, name } = parsedUserData;

  const [doaData, setdoaData] = useState(
    getChannelCode === "30" && JSON.parse(user)?.companyCode === "1100"
      ? { "Div Head": "Vp113006" }
      : {}
  );

  let payloadData = {
    data: {
      saleInfomation: salesStore,
      authorizeDirector: authorizeStore,
      billingAddress: billingStoreData,
      draftIndex: 2,
      ...doaData,
    },
    uploadItems: uploadStore,
  };

  const isValidSalesData = () => {
    const includesFields = [
      "salesOffice",
      "salesDistrict",
      "salesGroup",
      "shippingCondition",
      "paymentTerm",
      "creditLimit",
    ];
    return validateObjectIncludes(salesStore, includesFields);
  };

  const isValidAuthorizeData = () => {
    // List of fields to check
    const fieldsToCheck = [
      "firstName",
      "lastName",
      "countryCode",
      "postalCode",
      "city",
      "houseNo",
      "transportZoneCode",
      "region",
    ];

    // Check if every object in the array has empty values for the specified fields
    return authorizeStore?.every((obj) => {
      return fieldsToCheck.every((field) => obj[field] !== "");
    });
  };

  const isValidBillingData = () => {
    if (payloadData?.data?.billingAddress?.name?.length > 0) {
      let value_check = 0;
      payloadData?.data?.billingAddress?.name?.filter((x) => {
        if (x.trim()?.length > 0) {
          value_check += 1;
        }
      });
      if (value_check === payloadData?.data?.billingAddress?.name?.length) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const isAllFeildValid = () => {
    if (billingStoreData.billingAddressChoose === "sameAddress") {
      return isValidSalesData() && isValidAuthorizeData() ? true : false;
    } else {
      return isValidSalesData() &&
        isValidAuthorizeData() &&
        isValidBillingData()
        ? true
        : false;
    }
  };

  const handleSave = async () => {
    if (isUserCameForEdit) {
      setIsSaveLoading(true);
      const request = await putAxiosCall(
        `job/submitDraftJob/${jobId}`,
        payloadData
      );
      // console.log(request);
      // request.status === 200 && navigate("/user");
      if (request.status === 200) {
        setIsSaveLoading(false);
        navigate("/user");
      } else {
        setIsSaveLoading(false);
      }
    } else {
      const request = await putAxiosCall(
        `job/submitDraftJob/${userSaveJobId}`,
        payloadData
      );
      // console.log(request);
      // request.status === 200 && navigate("/user");
      if (request.status === 200) {
        setIsSaveLoading(false);
        navigate("/user");
      } else {
        setIsSaveLoading(false);
      }
    }
  };

  const checkConditionDOA = () => {
    try {
      if (JSON.parse(user)?.companyCode === "1100") {
        if (
          (salesStore?.priceList === "S" ||
            salesStore?.priceList === "M" ||
            salesStore?.priceList === "L") &&
          (getChannelCode === "20" ||
            getChannelCode === "30" ||
            getChannelCode === "40" ||
            getChannelCode === "50" ||
            getChannelCode === "60")
        ) {
          return true;
        } else {
          if (
            getChannelCode === "20" ||
            getChannelCode === "30" ||
            getChannelCode === "40" ||
            getChannelCode === "50" ||
            getChannelCode === "60"
          ) {
            if (
              doaData?.["Div Head"] === undefined ||
              payloadData?.data?.["Div Head"]?.length < 1
            ) {
              return false;
            } else {
              return true;
            }
          } else {
            if (
              doaData?.["Div Head"] === undefined ||
              doaData?.["SGH"] === undefined ||
              payloadData?.data?.["Div Head"]?.length < 1 ||
              payloadData?.data?.["SGH"]?.length < 1
            ) {
              return false;
            } else {
              return true;
            }
          }
        }
      } else if (JSON.parse(user)?.companyCode === "1200") {
        if (
          salesStore?.paymentTerm === "CCOD" ||
          salesStore?.paymentTerm === "CCDD" ||
          salesStore?.priceList === "S" ||
          salesStore?.priceList === "M" ||
          salesStore?.priceList === "L"
        ) {
          if (getChannelCode === "10" || getChannelCode === "20") {
            if (
              doaData?.["SGH"] === undefined ||
              payloadData?.data?.["SGH"]?.length < 1
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
              payloadData?.data?.["Div Head"]?.length < 1 ||
              payloadData?.data?.["SGH"]?.length < 1
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
              payloadData?.data?.["Div Head"]?.length < 1
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

  const handleSubmit = async () => {
    if (isUserCameForEdit) {
      setSubmitTrueInStore();
      if (isAllFeildValid() && checkConditionDOA()) {
        setIsDataSubmited(true);
        const request = await putAxiosCall(
          `job/submitSaveJob/${jobId}`,
          payloadData
        );

        if (request.status === 200) {
          // setCurrentIndex((prev) => prev + 1);
          setIsDataSubmited(false);
          resetSavedPayloadInStore();
          navigate(`/edituser/addinfo/3/${jobId}`);
        } else {
          setIsDataSubmited(false);
        }
      }
    } else {
      setSubmitTrueInStore();
      if (isAllFeildValid() && checkConditionDOA()) {
        setIsDataSubmited(true);
        const request = await putAxiosCall(
          `job/submitSaveJob/${userSaveJobId}`,
          payloadData
        );
        if (request.status === 200) {
          setIsDataSubmited(false);
          resetSavedPayloadInStore();
          setCurrentIndex((prev) => prev + 1);
        } else {
          setIsDataSubmited(false);
        }
      }
    }
  };

  function handleClosePopup() {
    setOpenPopup(false);
  }

  const handleBack = () => {
    if (location.pathname.includes("edituser")) {
      navigate(`/edituser/addinfo/1/${jobId}`);
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleCoApprovalPopup = () => {
    setSubmitTrueInStore();
    if (isAllFeildValid()) {
      if (uploadStore?.length > 0) {
        setOpenPopup(true);
      } else {
        toast.error("Please Upload File!", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }
  };

  useEffect(() => {
    jobId && fetchJob(jobId); // will run only for Edit case.
  }, []);

  useEffect(() => {
    Object.keys(getJobData?.verify ?? {}).length > 0 &&
      localStorage.setItem("channel", getJobData?.verify?.channel);
  }, [getJobData]);

  return (
    <>
      <ProgressBar activeStepLabel={1} getJobData={getJobData} />
      <SalesInfo employeeId={employeeId} name={name} />
      <AuthorizeDirector />
      <BillingAddress payloadData={payloadData} />
      <UploadSample />
      <div className="flex justify-end w-full">
        <div
          className="flex justify-center w-2/5 mt-6"
          style={{ marginBottom: "6rem" }}
        >
          {action === "addinfo" ? (
            <>
              <Button
                sx={{
                  marginRight: "14px",
                  color: "black",
                  border: "1px solid black",
                }}
                variant="outlined"
                size="medium"
                onClick={() => handleBack()}
              >
                Back
              </Button>
              <Button
                variant="contained"
                size="medium"
                sx={{ background: "gray", marginRight: "14px" }}
                onClick={handleSave}
                disabled={isSaveLoading}
              >
                {isSaveLoading ? "Loading..." : "Save"}
              </Button>
              <Button
                variant="contained"
                size="medium"
                style={{ color: "#FFFFFF", background: "#5ae4a7" }}
                onClick={() => handleCoApprovalPopup()}
                // disabled={isDataSubmited ? true : false}
              >
                {"SUBMIT"}
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
                onClick={() => setCurrentIndex(1)}
              >
                BACK
              </Button>
              <Button
                variant="contained"
                size="medium"
                sx={{ background: "gray", marginRight: "14px" }}
                onClick={() => navigate("/user")}
              >
                Back To Dashboard
              </Button>
            </>
          )}
          <ApprovalPopUp
            // handleSubmit={handleClickOpenCancel}
            handleClosePopup={handleClosePopup}
            open={openPopup}
            handleSubmit={handleSubmit}
            BoxTitle={"Please Select Approval"}
            setdoaData={setdoaData}
            doaData={doaData}
            isDataSubmited={isDataSubmited}
          />
        </div>
      </div>
    </>
  );
}
