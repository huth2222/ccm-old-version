import NavHeaderDashboard from "../../../CommonComponent/NavHeaderDashboard";
import { useEffect, useState } from "react";
import CreateUserForm from "./CreateUserForm";
import GeneralInfo from "./GeneralInfo";
import { SalesandDealerInfo } from "./SalesandDealerInfo";
import { ThankYouPage } from "./ThankYouPage";
import { useParams } from "react-router-dom";

export default function Create() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [verifyDataObj, setVerifyDataObj] = useState({});

  const currentComponent = [
    <CreateUserForm
      setCurrentIndex={setCurrentIndex}
      setVerifyDataObj={setVerifyDataObj}
    />,
    <GeneralInfo
      setCurrentIndex={setCurrentIndex}
      verifyDataObj={verifyDataObj}
    />,
    <SalesandDealerInfo setCurrentIndex={setCurrentIndex} />,
    <ThankYouPage />,
  ];

  let { jobIndex } = useParams();

  useEffect(() => {
    jobIndex && setCurrentIndex(jobIndex);

    return () => {
      // console.log("unmount..");
      setCurrentIndex(0);
    };
  }, [jobIndex]);

  return (
    <>
      <NavHeaderDashboard
        headingText={"Create/Change Customer Info."}
        requireActionBar={false}
      />
      {currentComponent[currentIndex]}
    </>
  );
}
