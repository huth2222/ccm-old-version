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
import { fetchDataList } from "../../../../Store/createUserStore";
import { Button } from "@mui/material";
import CommentBox from "../../../CommonComponent/CommentBox";

function OfficerGrouping() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [verifyDataObj, setVerifyDataObj] = useState({});
  const [rejectText, setRejectText] = useState("");
  const [open, setOpen] = useState(false);
  let { userId, action } = useParams();

  const resetJobStoreData = userDashboardStore(
    (state) => state.resetJobStoreData
  );
  const fetchJob = userDashboardStore((state) => state.fetchJob);
  const getJobData = userDashboardStore((state) => state.job);
  const isJobLoaded = userDashboardStore((state) => state.isJobLoaded);
  const updateLoadingState = userDashboardStore(
    (state) => state.setLoadedStateFalse
  );
  const fetchDropDownData = fetchDataList((state) => state.fetchDropDownData);
  const [passPayload, setPassPayload] = useState({});

  const handleClickOpen = (title) => {
    setOpen(true);
    setRejectText(title);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {}, []);

  // console.log({ passPayload });

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
  const getCompanyCode = getJobData?.verify?.companyCode;

  useEffect(() => {
    userId && fetchJob(userId);
    return () => {
      console.log("unmount..");
      setCurrentIndex(0);
    };
  }, []);

  useEffect(() => {
    fetchDropDownData(getCompanyCode);
  }, [getCompanyCode]);
  // console.log(userId);

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
      {/* <Button variant="contained">View Comments</Button> */}

      {currentComponent[currentIndex]}
    </>
  );
}

export default OfficerGrouping;
