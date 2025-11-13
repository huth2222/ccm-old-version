import PinBox from "../../../assets/PinBox.svg";
import LoginBanner from "../../../assets/LoginFrame.svg";
import Logo from "../../../assets/TOALogo.svg";
import { Button, InputLabel, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import AccountActivationForm from "./AccountActivationForm";
import ResetForm from "./ResetForm";
import { login } from "../../../Utility/Auth";
import TextInputDisabled from "../../CommonComponent/TextInputDisabled";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [currentForm, setCurentForm] = useState("Login");
  const [isSubmit, setIsSubmit] = useState(false);
  const [userData, setUserData] = useState({
    employeeId: "",
    password: "",
  });
  const userToken = localStorage.getItem("key");
  const navigate = useNavigate();

  const isValid = () => {
    const { employeeId, password } = userData;
    return employeeId && password ? true : false;
  };

  const handleUpdateForm = (formName) => {
    setCurentForm(formName);
  };

  const handleUserForm = (e) => {
    const { name, value } = e.target;
    const userInput = {
      ...userData,
      [name]: value,
    };
    setUserData(userInput);
  };

  // async function getUserData() {
  //   const responseData = await getAxiosCall("users/me");
  //   if (responseData.status === 200) {
  //     localStorage.setItem("userData", JSON.stringify(responseData.data));
  //   }
  //   console.log(responseData);
  // }

  const handleLogin = () => {
    setIsSubmit(true);
    // getUserData();
    isValid() && login(userData);
  };

  useEffect(() => {
    userToken && navigate("/user");
  }, []);

  return (
    <>
      {currentForm === "Login" ? (
        <div className="container h-screen mx-auto px-4 flex justify-around items-center flex-wrap">
          <img
            className=" sm:w-64 md:w-80 lg:w-96 xl:w-5/12 2xl:w-5/12"
            src={LoginBanner}
            alt="banner"
            loading="lazy"
          />
          <div className="sm:w-48 md:w-64 lg:w-80 xl:w-4/12 2xl:w-5/12 flex justify-around flex-col">
            <div>
              <div className="flex">
                <img className="mr-2" alt="toa" src={Logo} loading="lazy" />
                <div>
                  <h1 className=" tracking-wide text-xl font-semibold">
                    Login into Create/Change Customer Info.
                  </h1>
                  <small className="text-base">
                    Please use your employee ID.
                  </small>
                </div>
              </div>
              <div className="w-11/12 mt-4">
                <div className="mb-4">
                  <InputLabel
                    error
                    required={true}
                    style={{ color: "#000000" }}
                    htmlFor="useremail"
                  >
                    Employee ID
                  </InputLabel>
                  <TextField
                    className="p-8 w-full"
                    required
                    size="small"
                    placeholder="Enter Your employee ID."
                    id="useremail"
                    name="employeeId"
                    onChange={(e) => handleUserForm(e)}
                    error={isSubmit && !userData.employeeId ? true : false}
                    inputProps={{
                      autoComplete: "off",
                    }}
                  />
                </div>
                <div className="mb-4 w-full">
                  <InputLabel
                    error
                    required={true}
                    style={{ color: "#000000" }}
                    htmlFor="password"
                  >
                    Password
                  </InputLabel>
                  <TextField
                    className="p-8 w-full"
                    id="password"
                    size="small"
                    type="password"
                    autoComplete="off"
                    name="password"
                    onChange={(e) => handleUserForm(e)}
                    error={isSubmit && !userData.password ? true : false}
                    inputProps={{
                      autoComplete: "off",
                    }}
                  />
                </div>
                <div className="mb-4 flex justify-between flex-wrap">
                  <p className="text-green font-medium">
                    <span
                      className="cursor-pointer hover:font-bold"
                      onClick={() => handleUpdateForm("Activation")}
                    >
                      Activate Your Account.
                    </span>
                  </p>
                  <p className="text-blue font-normal">
                    <span
                      className="cursor-pointer hover:font-medium"
                      onClick={() => handleUpdateForm("Reset")}
                    >
                      Forgot Password?
                    </span>
                  </p>
                </div>
              </div>
              <Button
                variant="contained"
                className="w-11/12"
                style={{ color: "#FFFFFF", background: "#5ae4a7" }}
                onClick={() => handleLogin()}
              >
                SIGN IN
              </Button>
            </div>
          </div>
        </div>
      ) : currentForm === "Reset" ? (
        <ResetForm handleUpdateForm={handleUpdateForm} />
      ) : (
        currentForm === "Activation" && (
          <AccountActivationForm handleUpdateForm={handleUpdateForm} />
        )
      )}
    </>
  );
};

export default Login;
