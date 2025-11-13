import React, { useState, useRef, useEffect } from "react";
import { IconButton, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { useUploadItemStore } from "../../../../Store/createUserStore";
// import { validateFileType } from "../../../../Utility/Constant";
import { userDashboardStore } from "../../../../Store/jobDashboard";
import { useParams } from "react-router-dom";
import { putAxiosCallWthDataTypeJson } from "../../../../Utility/HelperFunction";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const UploadSampleChange = ({ className = "w-full" }) => {
  const { action, jobId } = useParams();
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);
  const [fileKey, setFileKey] = useState(0);

  const updateUploadItemStore = useUploadItemStore(
    (state) => state.updateUploadItemsState
  );

  const updateJobLoadingStoreFalse = userDashboardStore(
    (state) => state.setJobLoadedStateFalse
  );

  const isJobDataLoadedFromAPI = userDashboardStore(
    (state) => state.isJobLoaded
  );

  const getJobData = userDashboardStore((state) => state.job);

  const handleFileDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const fileList = event.dataTransfer.files;

    if (fileList.length > 1) {
      setErrorMessage("Please upload only one file.");
      return;
    }

    if (files.length > 0) {
      setErrorMessage(
        "Please Delete first and then upload, max one file is allowed."
      );
      return;
    }

    const file = fileList[0];
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage(
        "Invalid file format. Allowed: PDF, JPEG, JPG, PNG, Excel"
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("File size exceeds 10MB limit.");
      return;
    }
    setFiles([file]);
    setErrorMessage("");
  };

  const handleRemoveFile = async (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    setErrorMessage("");
    setFileKey(0);
  };

  const handleFileInputChange = (event) => {
    const fileList = event.target.files;

    if (fileList.length > 1) {
      setErrorMessage("Please upload only one file.");
      return;
    }

    if (files.length > 0) {
      setErrorMessage(
        "Please Delete first and then upload, max one file is allowed."
      );
      return;
    }

    const file = fileList[0];
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage(
        "Invalid file format. Allowed: PDF, JPEG, JPG, PNG, Excel"
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("File size exceeds 10MB limit.");
      return;
    }

    setFiles([file]);
    setErrorMessage("");
    setFileKey((prevKey) => prevKey + 1);
  };

  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  const updateLocalStateForEdit = (salesParamsJobData) => {
    const extractedData = salesParamsJobData?.uploadItems
      ? salesParamsJobData.uploadItems
      : files;
    setFiles(extractedData);
    // console.log(extractedData, "4444444");
  };

  useEffect(() => {
    updateUploadItemStore(files);
  }, [files]);

  // effect for edit
  useEffect(() => {
    isJobDataLoadedFromAPI && updateLocalStateForEdit(getJobData);
    updateJobLoadingStoreFalse();
  }, [isJobDataLoadedFromAPI]);

  const handleDownload = async (fileUrl, fileName) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.setAttribute("download", fileName);
    a.setAttribute("target", "_blank");
    a.click();
  };

  return (
    <div className="flex justify-around lg:mx-10 xs:my-8 lg:my-8 ">
      <div className="w-4/12 lg:pl-42">
        <p className="mb-4 subpixel-antialiased font-semibold text-green lg:text-3xl">
          Upload Item
        </p>
      </div>
      <div className="flex flex-col w-2/5">
        <div
          style={{
            textAlign: "center",
            display:
              action === "edit" || action === undefined ? "block" : "none",
          }}
        >
          <div
            className={className}
            style={{
              border: "2px dashed #5ae4a7",
              borderRadius: "5px",
              padding: "20px",
              margin: "20px auto",
              height: "160px",
              position: "relative",
              cursor: "pointer",
            }}
            onDrop={handleFileDrop}
            onClick={handleBoxClick}
            onDragOver={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
          >
            <input
              type="file"
              accept=".pdf, .jpeg, .jpg, .png, .xlsx"
              onChange={handleFileInputChange}
              style={{ display: "none" }}
              id="file-input"
              key={fileKey}
              ref={fileInputRef}
            />
            <IconButton
              style={{
                position: "absolute",
                top: "70%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "#5ae4a7",
                width: "32px",
                height: "32px",
                fontSize: "40px",
              }}
              component="span"
            >
              <CloudUploadIcon fontSize="inherit" />
            </IconButton>
            <p className="font-semibold" style={{ color: "#857f7f" }}>
              Drag & Drop Image, PDF and Excel files here or click to select
              files
            </p>
            <span className="font-semibold" style={{ color: "#857f7f" }}>
              ( Max 1 files, Size 10MB ).
            </span>
          </div>
          {errorMessage && (
            <p style={{ color: "red", marginBottom: "1rem" }}>{errorMessage}</p>
          )}
        </div>
        {/* {console.log("action", action)} */}
        {files.length > 0 && (
          <div style={{ display: `${files.length < 1 ? "none" : "block"}` }}>
            <div className="flex flex-col items-center justify-center w-full border border-dashed rounded-md border-gray">
              {files?.map((file, index) => {
                if (action === "edit" || action === undefined) {
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between w-10/12 mt-3 mb-3 border-black rounded-lg"
                    >
                      <div className="flex items-center ">
                        <InsertDriveFileOutlinedIcon
                          color="primary"
                          fontSize="large"
                          className="hover:bg-sky-700"
                          style={{ cursor: "pointer" }}
                        />
                        <div className="ml-4">
                          <p>{file.name ? file.name : file.originalname}</p>
                          {file.size && (
                            <p style={{ color: "gray" }}>
                              {(file.size / 1024 ** 2).toFixed(2)} MB
                              <span className="ml-4"></span>
                            </p>
                          )}
                        </div>
                      </div>
                      <IconButton
                        onClick={() => handleRemoveFile(index)}
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between w-10/12 mt-3 mb-3 border-black rounded-lg"
                    >
                      <div className="flex items-center ">
                        <InsertDriveFileOutlinedIcon
                          color="primary"
                          fontSize="large"
                          onClick={() =>
                            handleDownload(
                              file.url,
                              file.url.substring(file.url.lastIndexOf("/") + 1)
                            )
                          }
                          className="hover:bg-sky-700"
                          style={{ cursor: "pointer" }}
                        />
                        <div className="ml-4">
                          {/* <p>{file.originalname}</p> */}
                          <p>
                            {file.url.substring(file.url.lastIndexOf("/") + 1)}
                          </p>
                          {/* <a href="file.url" download={true}>
                      Download
                    </a> */}
                        </div>
                      </div>
                      <IconButton
                        // onClick={() => removefile(index)}
                        // aria-label="delete"
                        color="success"
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        )}
        {(action === "edit" || action === "view" || action === "status") &&
          files.length === 0 && <p>Not Have File.</p>}
      </div>
    </div>
  );
};

export default UploadSampleChange;
