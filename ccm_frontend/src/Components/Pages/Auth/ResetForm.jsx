import { Button, InputLabel, TextField } from "@mui/material";
import LoginBanner from "../../../assets/Frame.svg";
import Logo from "../../../assets/TOALogo.svg";
import { useState } from "react";
import { forgetPassword } from "../../../Utility/Auth";

const ResetForm = ({ handleUpdateForm }) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [userData, setUserData] = useState({
    employeeId: "",
    email: "",
    newPassword: "",
  });

  const handleUserForm = (e) => {
    const { name, value } = e.target;
    const userInput = {
      ...userData,
      [name]: value,
    };
    setUserData(userInput);
  };

  const isValid = () => {
    const { employeeId, email, newPassword } = userData;
    return employeeId && email && newPassword ? true : false;
  };

  const resetPassword = async () => {
    setIsSubmit(true);
    isValid() && forgetPassword(userData);
  };

  return (
    <div className="container h-screen mx-auto px-4 flex justify-around items-center flex-wrap">
      <img
        className=" sm:w-64 md:w-80 lg:w-96 xl:w-4/12 2xl:w-5/12"
        src={LoginBanner}
        alt="banner"
        loading="lazy"
      />
      <div className="sm:w-48 md:w-64 lg:w-80 xl:w-4/12 2xl:w-5/12 flex justify-around flex-col">
        <div>
          <div className="flex">
            <img className="mr-2" alt="toa" src={Logo} loading="lazy" />
            <div>
              <h1 className=" tracking-wide text-2xl font-semibold">
                FORGOT PASSWORD?
              </h1>
              <small className="text-base">Reset Your Password here.</small>
            </div>
          </div>
          <div className="w-11/12 mt-4">
            <div className="mb-4">
              <InputLabel
                htmlFor="username"
                required={true}
                style={{ color: "#000000" }}
                error
              >
                Username
              </InputLabel>
              <TextField
                className="p-8 w-full"
                required
                size="small"
                placeholder="Enter Your Emp Id."
                id="username"
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
                htmlFor="useremail"
                required={true}
                style={{ color: "#000000" }}
                error
              >
                Email
              </InputLabel>
              <TextField
                className="p-8 w-full"
                required
                type="email"
                size="small"
                placeholder="Enter Your Registered email."
                id="useremail"
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
                htmlFor="password"
                required={true}
                style={{ color: "#000000" }}
              >
                Password
              </InputLabel>
              <TextField
                required
                className="p-8 w-full"
                id="password"
                size="small"
                type="password"
                name="newPassword"
                onChange={(e) => handleUserForm(e)}
                error={isSubmit && !userData.newPassword ? true : false}
                inputProps={{
                  autoComplete: "off",
                }}
              />
            </div>
            <p className="text-blue font-thin text-right mb-4 ">
              <span
                className="cursor-pointer hover:font-medium"
                onClick={() => handleUpdateForm("Login")}
              >
                Have You Remember Password? Login Here.
              </span>
            </p>
          </div>
          <Button
            variant="contained"
            className="w-11/12"
            style={{ color: "#FFFFFF", background: "#5ae4a7" }}
            onClick={() => resetPassword()}
          >
            RESET PASSWORD
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetForm;
