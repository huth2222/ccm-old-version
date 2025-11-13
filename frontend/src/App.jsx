import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "./Components/HOC/ProtectedRoute";
import Loader from "./Components/Pages/Loader";
import RegisterView from "./Components/Pages/UserRoleDashboard/CreateUser/RegisterView";
import NotFound from "./Components/Pages/NotFound";
import { ToastContainer } from "react-toastify";
import { userDashboardStore } from "./Store/jobDashboard";

const Login = lazy(() => import("./Components/Pages/Auth/Login"));
const Dashboard = lazy(() => import("./Components/Pages/Dashboard"));
const GeneralInfo = lazy(() =>
  import("./Components/Pages/UserRoleDashboard/CreateUser/GeneralInfo")
);
const Create = lazy(() =>
  import("./Components/Pages/UserRoleDashboard/CreateUser/Create")
);
const OfficerGrouping = lazy(() =>
  import("./Components/Pages/UserRoleDashboard/AROfficer/OfficerGrouping")
);
const MasterGrouping = lazy(() =>
  import("./Components/Pages/UserRoleDashboard/ARMaster/MasterGrouping")
);

const Report = lazy(() =>
  import("./Components/Pages/UserRoleDashboard/ARMaster/Report")
);

const UserActivationRequestList = lazy(() =>
  import(
    "./Components/Pages/UserRoleDashboard/MyAdmin/SuperAdmin/UserActivationRequestList"
  )
);
const UploadUser = lazy(() =>
  import("./Components/Pages/UserRoleDashboard/MyAdmin/UploadUser")
);
const UploadDOA = lazy(() =>
  import("./Components/Pages/UserRoleDashboard/MyAdmin/UploadDOA")
);
const UploadApproverStep = lazy(() =>
  import("./Components/Pages/UserRoleDashboard/MyAdmin/UploadApproverStep")
);
const UploadPossibelEntries = lazy(() =>
  import("./Components/Pages/UserRoleDashboard/MyAdmin/UploadPossibelEntries")
);
const ChangeGrouping = lazy(() =>
  import("./Components/Pages/UserRoleDashboard/Change/ChangeGrouping")
);

function App() {
  const fetchFilterDropdownData = userDashboardStore(
    (state) => state.getSelectionData
  );

  useEffect(() => {
    fetchFilterDropdownData();
  }, []);
  // console.log("inside app.js");
  return (
    <Suspense
      fallback={
        <>
          <Loader />
        </>
      }
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/registerview"
            element={
              <ProtectedRoute>
                <RegisterView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/personal"
            element={
              <ProtectedRoute>
                <GeneralInfo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createuser/:action"
            element={
              <ProtectedRoute>
                <Create />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edituser/:action/:jobIndex/:jobId"
            element={
              <ProtectedRoute>
                <Create />
              </ProtectedRoute>
            }
          />
          <Route
            path="/aro/:action/:userId"
            element={
              <ProtectedRoute>
                <OfficerGrouping />
              </ProtectedRoute>
            }
          />
          <Route
            path="/arm/:action/:userId"
            element={
              <ProtectedRoute>
                <MasterGrouping />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-management"
            element={
              <ProtectedRoute>
                <UserActivationRequestList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-request"
            element={
              <ProtectedRoute>
                <ChangeGrouping />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-request/:action/:jobId"
            element={
              <ProtectedRoute>
                <ChangeGrouping />
              </ProtectedRoute>
            }
          />
          <Route
            path="/uploaduser"
            element={
              <ProtectedRoute>
                <UploadUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/uploaddoa"
            element={
              <ProtectedRoute>
                <UploadDOA />
              </ProtectedRoute>
            }
          />
          <Route
            path="/uploadapprover"
            element={
              <ProtectedRoute>
                <UploadApproverStep />
              </ProtectedRoute>
            }
          />
          <Route
            path="/possiblentries"
            element={
              <ProtectedRoute>
                <UploadPossibelEntries />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </Suspense>
  );
}

export default App;
