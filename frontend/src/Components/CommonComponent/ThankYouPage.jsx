import { Button } from "@mui/material";
import GreenTick from "../../assets/GreenTick.svg";
import { useNavigate } from "react-router-dom";

export default function ThankYouPage() {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="w-2/5 flex justify-around items-center content-around flex-col">
        <h1 className="text-2xl mb-6">Thank You for Submit Document.</h1>
        <img
          className="w-24 h-24 mb-6"
          src={GreenTick}
          alt="Success"
          loading="lazy"
        />
        <Button
          variant="contained"
          className="w-6/12"
          style={{ color: "#FFFFFF", background: "#5ae4a7" }}
          onClick={() => navigate("/user")}
        >
          BACK TO HOMEPAGE
        </Button>
      </div>
    </div>
  );
}
