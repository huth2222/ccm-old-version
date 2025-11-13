import React, { useEffect, useState } from "react";
import ProgressBar from "../../../CommonComponent/ProgressBar";
import NavHeaderDashboard from "../../../CommonComponent/NavHeaderDashboard";
import ThankYouPage from "../../../CommonComponent/ThankYouPage";
import GeneralGrouping from "./GeneralGrouping";
import { userDashboardStore } from "../../../../Store/jobDashboard";
import {
  fetchDataList,
  useGeneralInfoStore,
} from "../../../../Store/createUserStore";
import { useParams } from "react-router-dom";
import Loader from "../../Loader";

function ChangeGrouping() {
  const { action, jobId } = useParams();
  const fetchJob = userDashboardStore((state) => state.fetchJob);
  const getJobDatafromStore = userDashboardStore((state) => state.job);
  const userSaveJobId = useGeneralInfoStore((state) => state.id);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fetchDropDownData = fetchDataList((state) => state.fetchDropDownData);
  const [userJobId, setuserJobId] = useState(userSaveJobId);
  const [didSendForUpdate, setDidSendForUpdate] = useState(false);

  const currentComponent = [
    <GeneralGrouping
      userSaveJobId={userJobId}
      setCurrentIndex={setCurrentIndex}
    />,
    <ThankYouPage />,
  ];
  useEffect(() => {
    setDidSendForUpdate(true);
    userSaveJobId && fetchJob(userSaveJobId);
    setDidSendForUpdate(false);
  }, [userSaveJobId]);

  useEffect(() => {
    setDidSendForUpdate(true);
    jobId && fetchJob(jobId);
    jobId && setuserJobId(jobId);
    setDidSendForUpdate(false);
  }, [action, jobId]);

  const verifyData = getJobDatafromStore?.verify;

  useEffect(() => {
    if (
      action &&
      action !== "add" &&
      Object.entries(getJobDatafromStore).length > 0
    ) {
      verifyData && localStorage.setItem("channel", verifyData?.channel);
      verifyData.companyCode && fetchDropDownData(verifyData.companyCode);
    }
  }, [getJobDatafromStore, verifyData]);

  return (
    <div>
      {didSendForUpdate ? (
        <Loader />
      ) : (
        <>
          <NavHeaderDashboard
            component
            headingText={"Change Customer Info."}
            requireActionBar={false}
          />
          {currentIndex !== 1 && (
            <ProgressBar
              activeStepLabel={2}
              isCommentBoxVisible={true}
              getJobData={getJobDatafromStore}
            />
          )}

          {currentComponent[currentIndex]}
        </>
      )}
    </div>
  );
}

export default ChangeGrouping;
