import axios from "axios";
import FormData from "form-data";
import { toast } from "react-toastify";

const toastClasses = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const getAxiosCall = async (endpoint) => {
  const url = ROOT_API + endpoint;
  const headerData = {
    method: "get",
    url: url,
    headers: { Authorization: `Bearer ${localStorage.getItem("key")}` },
  };

  try {
    const response = await axios(headerData);
    if (response.status !== 200) {
      toast.error("Error. Please try again.", toastClasses);
    }
    // console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    const errorMessage = error.response.data.message;
    // toast.error(errorMessage, toastClasses);
    return error;
  }
};

export const postAxiosCall = async (endpoint, data) => {
  // console.log(data);
  const url = ROOT_API + endpoint;
  const headerData = {
    method: "post",
    url: url,
    headers: { Authorization: `Bearer ${localStorage.getItem("key")}` },
    data: data,
  };

  try {
    const response = await axios(headerData);
    if (response.status !== 200) {
      toast.error("Error. Please try again.", toastClasses);
    }
    return response;
  } catch (error) {
    console.log(error);
    const errorMessage = error?.response?.data?.error;
    // toast.error(errorMessage, toastClasses);
    return "error";
  }
};

export const putAxiosCall = async (endpoint, payload) => {
  const url = ROOT_API + endpoint;

  const formData = new FormData();
  formData.append("data", JSON.stringify(payload.data));
  // formData.append("files", payload.uploadItems);
  if (payload.uploadItems) {
    for (const file of payload.uploadItems) {
      formData.append("files", file);
    }
  }

  // console.log({formData});

  try {
    const response = await axios.put(url, formData, {
      headers: formData.getHeaders
        ? formData.getHeaders()
        : {
            Authorization: `Bearer ${localStorage.getItem("key")}`,
            "Content-Type": "multipart/form-data",
          },
    });
    // console.log(response);
    if (response.status !== 200) {
      toast.error("Error. Please try again.", toastClasses);
    }
    return response;
  } catch (error) {
    console.log(error);
    const errorMessage = error.response.data.error;
    return error;
  }
};

export const postFileUpload = async (endpoint, payload) => {
  const url = ROOT_API + endpoint;
  const formData = new FormData();

  // Append each file to the FormData object
  payload.forEach((file, index) => {
    formData.append(`file`, file); // Append each file with a unique key
  });

  try {
    const response = await axios.post(url, formData, {
      headers: formData.getHeaders
        ? formData.getHeaders()
        : {
            Authorization: `Bearer ${localStorage.getItem("key")}`,
            "Content-Type": "multipart/form-data",
          },
    });
    // console.log(response);
    if (response.status !== 200) {
      toast.error("Error. Please try again.", toastClasses);
    }
    return response;
  } catch (error) {
    console.log(error);
    const errorMessage = error.response.data.error;
    return error;
  }
};

export const putAxiosCallWthDataTypeJson = async (endpoint, data) => {
  // console.log(data);
  const url = ROOT_API + endpoint;
  const headerData = {
    method: "put",
    url: url,
    headers: { Authorization: `Bearer ${localStorage.getItem("key")}` },
    data: data,
  };

  try {
    const response = await axios(headerData);
    if (response.status !== 200) {
      toast.error("Error. Please try again.", toastClasses);
    }
    return response;
  } catch (error) {
    console.log(error);
    const errorMessage = error?.response?.data?.error
      ? error?.response?.data?.error
      : error?.response?.data?.message;
    // toast.error(errorMessage, toastClasses);
    return error;
  }
};

export function reorderObjectKeys(objectFromAPI, keyOrder) {
  const orderedObject = {};
  keyOrder.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(objectFromAPI, key)) {
      orderedObject[key] = objectFromAPI[key];
    }
  });
  return orderedObject;
}
