import { memo, useEffect, useState } from "react";
import UserActivationRequestList from "./UserRoleDashboard/MyAdmin/SuperAdmin/UserActivationRequestList";
import SalesManDashboard from "./UserRoleDashboard/Salesman/SalesManDashboard";
import { getAxiosCall } from "../../Utility/HelperFunction";
import Loader from "./Loader";
import OfficerDashboard from "./UserRoleDashboard/AROfficer/OfficerDashboard";
import MasterDashboard from "./UserRoleDashboard/ARMaster/MasterDashboard";
// import { userDashboardStore } from "../../Store/jobDashboard";

const Dashboard = () => {
  const userrole = localStorage.getItem("role");
  const userData = localStorage.getItem("userData");
  const [haveUserData, sethaveUserData] = useState(userData ? true : false);
  // const [definedRole, setDefinedRole] = useState("");

  const getUserData = async () => {
    const responseData = await getAxiosCall("users/me");
    if (responseData?.status === 200) {
      sethaveUserData(true);
      localStorage.setItem("userData", JSON.stringify(responseData?.data));
    }
    // console.log(responseData);
  };
  useEffect(() => {
    !userData && getUserData();
  }, []);

  const userParsedData = userData ? JSON.parse(userData) : {};
  // const { companyCode, distChannel, level } = JSON.parse(userData);

  // console.log("calling...", companyCode, distChannel, level);

  const userRole = `${userParsedData?.userType} ${userParsedData?.role}`;
  // console.log("Logged In As ", userRole);

  return (
    <>
      {haveUserData ? (
        userrole === "SUPER ADMIN" ? (
          <UserActivationRequestList />
        ) : userrole === "Officer" && userParsedData?.userType === "AR" ? (
          <OfficerDashboard role={userRole} />
        ) : userrole === "AR Master" && userParsedData?.userType === "AR" ? (
          <MasterDashboard role={"AR Master"} />
        ) : userRole === "Sale Officer" ? (
          <SalesManDashboard />
        ) : (
          <OfficerDashboard role={userRole} />
        )
      ) : (
        <Loader />
      )}
    </>
  );
};

export default memo(Dashboard);
