import { NavLink } from "react-router-dom";
import Image404 from "../../assets/404.gif";

const NotFound = () => {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div>
      <div style={containerStyle}>
        <img alt="404" src={Image404} loading="lazy" />
        <NavLink
          to="/"
          className="px-6 py-2 rounded-full"
          style={{ color: "#FFFFFF", background: "#5ae4a7" }}
        >
          Go To Home
        </NavLink>
      </div>
    </div>
  );
};

export default NotFound;
