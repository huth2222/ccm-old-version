import React, { useState } from "react";
import NavHeader from "../../../CommonComponent/NavHeader";
import FileUpload from "../../../CommonComponent/FileUpload";
import {
  postAxiosCall,
  postFileUpload,
} from "../../../../Utility/HelperFunction";
import { toast } from "react-toastify";

export default function UploadUser() {
  const toastClasses = {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  const [files, setFiles] = useState([]);
  const handleSubmit = () => {
    const url = `admin/importUsers`;
    const sendRequest = postFileUpload(url, files);
    console.log(sendRequest);
    if (sendRequest.status === 200) {
      toast.success("File Uploaded Successfully.", toastClasses);
    }
  };

  return (
    <div>
      <NavHeader
        headingText={"Upload User"}
        fromDate={false}
        toDate={false}
        createButton={false}
        filterNeeded={false}
      />
      <p
        style={{ color: "#595151b5" }}
        className=" text-center mt-8 text-2xl font-semibold"
      >
        Upload TOA Users In the System.
      </p>
      <div
        style={{ height: "78vh" }}
        className="flex flex-col h-screen justify-center items-center"
      >
        <FileUpload handleSubmit={handleSubmit} setFilesForReques={setFiles} />
      </div>
    </div>
  );
}
