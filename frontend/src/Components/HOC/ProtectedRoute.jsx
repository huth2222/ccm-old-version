/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

function ProtectedRoute({ isSignedIn, children }) {
  if (!localStorage.getItem("role")) {
    return <Navigate to="/" replace />;
  }
  return children;
}
export default ProtectedRoute;
