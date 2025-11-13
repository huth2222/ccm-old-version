import { Button, InputLabel, TextField } from "@mui/material";
import LoginBanner from "../../../assets/Frame.svg";
import { useState } from "react";
import Logo from "../../../assets/TOALogo.svg";
import GreenTick from "../../../assets/GreenTick.svg";
import { sendForActivate } from "../../../Utility/Auth";
import { useNavigate } from "react-router-dom";

const AccountActivationForm = ({ handleUpdateForm }) => {
  // const navigate = useNavigate();
  const [isActivated, setIsActivated] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const isValid = () => {
    const { email, password, confirmPassword } = userData;
    return email && password && confirmPassword ? true : false;
  };

  const handleUserForm = (e) => {
    const { name, value } = e.target;
    const userInput = {
      ...userData,
      [name]: value,
    };
    setUserData(userInput);
  };

  const activateUserAccount = async () => {
    setIsSubmit(true);
    if (isValid()) {
      const fnCall = await sendForActivate(userData);
      console.log(fnCall);
      fnCall?.status === 200 ? setIsActivated(true) : setIsActivated(false);
    }
  };

  // console.log(userData);
  return (
    <div className="container h-screen mx-auto px-4 flex justify-around items-center flex-wrap">
      <img
        className=" sm:w-64 md:w-80 lg:w-96 xl:-4/12 2xl:w-5/12"
        src={LoginBanner}
        alt="banner"
        loading="lazy"
      />
      {!isActivated ? (
        <div className="sm:w-48 md:w-64 lg:w-80 xl:w-4/12 2xl:w-5/12 flex justify-around flex-col">
          <div>
            <div className="flex">
              <img className="mr-2" alt="toa" src={Logo} loading="lazy" />
              <div>
                <h1 className=" tracking-wide text-2xl font-semibold">
                  Activate account with email.
                </h1>
                <small className="text-base">
                  Please use your company email.
                </small>
              </div>
            </div>
            <div className="w-11/12 mt-4">
              <div className="mb-4">
                <InputLabel
                  htmlFor="email"
                  error
                  required={true}
                  style={{ color: "#000000" }}
                >
                  Email
                </InputLabel>
                <TextField
                  className="p-8 w-full"
                  size="small"
                  placeholder="Enter Your company email."
                  id="email"
                  name="email"
                  onChange={(e) => handleUserForm(e)}
                  error={isSubmit && !userData.email ? true : false}
                  inputProps={{
                    autoComplete: "off",
                  }}
                />
              </div>
              <div className="mb-4 w-full">
                <InputLabel
                  error
                  htmlFor="password"
                  required={true}
                  style={{ color: "#000000" }}
                >
                  Password
                </InputLabel>
                <TextField
                  className="p-8 w-full"
                  id="password"
                  size="small"
                  type="password"
                  name="password"
                  onChange={(e) => handleUserForm(e)}
                  error={isSubmit && !userData.password ? true : false}
                  inputProps={{
                    autoComplete: "off",
                  }}
                />
              </div>
              <div className="mb-4 w-full">
                <InputLabel
                  error
                  htmlFor="confirm-password"
                  required={true}
                  style={{ color: "#000000" }}
                >
                  Confirm Password
                </InputLabel>
                <TextField
                  className="p-8 w-full"
                  id="confirm-password"
                  size="small"
                  type="password"
                  autoComplete="off"
                  name="confirmPassword"
                  onChange={(e) => handleUserForm(e)}
                  error={isSubmit && !userData.confirmPassword ? true : false}
                />
              </div>
              <p className="text-blue font-thin text-right mb-4 ">
                <span
                  className="cursor-pointer hover:font-medium"
                  onClick={() => handleUpdateForm("Login")}
                >
                  Have an account? Login
                </span>
              </p>
            </div>
            <Button
              variant="contained"
              className="w-11/12"
              style={{ color: "#FFFFFF", background: "#5ae4a7" }}
              onClick={activateUserAccount}
            >
              CONTINUE
            </Button>
          </div>
        </div>
      ) : (
        <div className="sm:w-48 md:w-64 lg:w-80 xl:w-3/12 2xl:w-4/12 flex justify-around items-center content-around flex-col">
          <h1 className="text-2xl mb-6">
            Thank You for Activate Your Account.
          </h1>
          <img
            className="w-24 h-24 mb-6"
            src={GreenTick}
            alt="Success"
            loading="lazy"
          />
          <Button
            variant="contained"
            className="w-11/12"
            style={{ color: "#FFFFFF", background: "#5ae4a7" }}
            onClick={() => handleUpdateForm("Login")}
          >
            CONTINUE To LOGIN
          </Button>
        </div>
      )}
    </div>
  );
};

export default AccountActivationForm;
