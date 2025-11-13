// import NavHeaderDashboard from "../../../CommonComponent/NavHeaderDashboard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BillingInfo from "./BillingInfo";
import NavHeaderDashboard from "../../../CommonComponent/NavHeaderDashboard";
import SalesInfo from "./SalesInfo";
import GeneralInfo from "./GeneralInfo";
import AuthorizeDirector from "./AuthorizeDirector";
import ProgressBar from "../../../CommonComponent/ProgressBar";
import ButtonGroup from "./ButtonGroup";
import { UploadItems } from "./UploadItems";
import ThankYouPage from "../../../CommonComponent/ThankYouPage";
import RejectReasonPopUP from "../../../CommonComponent/RejectReasonPopUP";
import { userDashboardStore } from "../../../../Store/jobDashboard";
import {
  fetchDataList,
  useAuthorizeStore,
  useBillingStore,
  useSalesStore,
  useUploadItemStore,
} from "../../../../Store/createUserStore";

function MasterGrouping() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [verifyDataObj, setVerifyDataObj] = useState({});
  const [rejectText, setRejectText] = useState("");
  const [open, setOpen] = useState(false);
  let { userId } = useParams();
  const [isSubmit, setIsSubmit] = useState(false);

  // const resetJobStoreData = userDashboardStore(
  //   (state) => state.resetJobStoreData
  // );
  const fetchJob = userDashboardStore((state) => state.fetchJob);
  const getJobData = userDashboardStore((state) => state.job);
  // const isJobLoaded = userDashboardStore((state) => state.isJobLoaded);
  // const updateLoadingState = userDashboardStore(
  //   (state) => state.setLoadedStateFalse
  // );
  const fetchDropDownData = fetchDataList((state) => state.fetchDropDownData);
  const [passPayload, setPassPayload] = useState({});

  // const salesStore = useSalesStore((state) => state.saleInfomation);
  // const authorizeStore = useAuthorizeStore((state) => state.authorizeDirector);
  // const billingStoreData = useBillingStore((state) => state.billingAddress);
  // const billingInfoStore = useBillingStore((state) => state.billingStoreData);
  // const uploadStore = useUploadItemStore((state) => state.uploadItems);

  const handleClickOpen = (title) => {
    setOpen(true);
    setRejectText(title);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const currentComponent = [
    <>
      <GeneralInfo
        setCurrentIndex={setCurrentIndex}
        jobDataFromStore={getJobData}
        handleClickOpenWithTitle={handleClickOpen}
        setRejectText={setRejectText}
      />
      <RejectReasonPopUP
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
        open={open}
        rejectTitle={rejectText}
        userId={userId}
      />
    </>,
    <>
      <SalesInfo
        setCurrentIndex={setCurrentIndex}
        verifyDataObj={verifyDataObj}
        jobDataFromStore={getJobData}
        setPassPayload={setPassPayload}
      />
      <AuthorizeDirector
        jobDataFromStore={getJobData}
        setCurrentIndex={setCurrentIndex}
      />
      <BillingInfo jobDataFromStore={getJobData} />
      <UploadItems jobDataFromStore={getJobData} userId={userId} />
      <ButtonGroup
        handleClickOpen={handleClickOpen}
        setCurrentIndex={setCurrentIndex}
        setRejectText={setRejectText}
        payload={passPayload}
        userId={userId}
        userRole={"ARMaster"}
        setIsSubmit={setIsSubmit}
        isSubmit={isSubmit}
      />
      <RejectReasonPopUP
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
        open={open}
        rejectTitle={rejectText}
        userId={userId}
      />
    </>,
    <ThankYouPage />,
  ];

  const user = localStorage.getItem("userData");
  const parsedUserData = JSON.parse(user);

  useEffect(() => {
    userId && fetchJob(userId);
    parsedUserData.companyCode && fetchDropDownData(parsedUserData.companyCode);
    return () => {
      console.log("unmount..");
      setCurrentIndex(0);
    };
  }, []);

  return (
    <>
      <NavHeaderDashboard
        headingText={"Create/Change Customer Info."}
        requireActionBar={false}
      />
      <ProgressBar
        activeStepLabel={2}
        isCommentBoxVisible={true}
        getJobData={getJobData}
      />
      {currentComponent[currentIndex]}
    </>
  );
}

export default MasterGrouping;
