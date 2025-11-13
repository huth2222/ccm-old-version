import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const setUser = (userData) => localStorage.setItem("email", userData);
const setUserRole = (userData) => localStorage.setItem("role", userData);
const setUserToken = (userData) => localStorage.setItem("key", userData);
// const navigate = useNavigate()

const toastClasses = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

const toastSuccessClasses = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

export const login = (data) => {
  const url = ROOT_API + `auth/login`;

  axios
    .post(url, data)
    .then((res) => {
      // console.log(res.data);
      if (res.status == 200) {
        setUser(res.data.email);
        setUserRole(res.data.role);
        setUserToken(res.data.token);
        window.location.href = "/user";
      } else {
        toast.error("Something is Wrong.", toastClasses);
      }
    })
    .catch((error) => {
      console.log(error.response.data.error);
      const errorMessage = error.response.data.error;
      // toast.error(errorMessage, toastClasses)
      return error;
    });
};

export const forgetPassword = (data) => {
  const url = ROOT_API + `forgot-password`;

  axios
    .post(url, data)
    .then((res) => {
      // console.log(res);
      if (res.status === 200) {
        toast.success("Successfully Changed Password.", toastSuccessClasses);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    })
    .catch(function (error) {
      console.log(error);
      const errorMessage = error.response.data.error;
      // toast.error(errorMessage, toastClasses);
    });
};

export const sendForActivate = async (data) => {
  const url = ROOT_API + `activate-user`;
  try {
    const request = await axios.post(url, data);
    // const resdata = await request;
    console.log(request);
    return request;
  } catch (error) {
    console.log(error);
    const errorMessage = error.response.data.error;
    // toast.error(errorMessage, toastClasses);
  }
};
