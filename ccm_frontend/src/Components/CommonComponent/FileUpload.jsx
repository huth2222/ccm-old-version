import React, { useEffect, useRef, useState } from "react";
import { Button, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "./fileUploadStyle.css";
import DeleteIcon from "@mui/icons-material/Delete";
import SouthIcon from "@mui/icons-material/South";

const FileUpload = ({
  handleSubmit,
  setFilesForReques,
  className = "w-full",
  maxFile = 1,
  isLoading = false,
}) => {
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);
  const handleFileDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const newFiles = [...files];
    const fileList = event.dataTransfer.files;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("File size exceeds 10MB limit.");
        return;
      }

      if (
        file.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setErrorMessage("Only Excel files are allowed.");
        return;
      }

      if (
        newFiles.findIndex((f) => f.name === file.name) === -1 &&
        newFiles.length < maxFile
      ) {
        newFiles.push(file);
      } else {
        setErrorMessage("Duplicate file found or maximum file limit reached.");
        return;
      }
    }

    setFiles(newFiles);
    setErrorMessage("");
  };

  const handleFileInputChange = (event) => {
    const newFiles = [...files];
    const fileList = event.target.files;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("File size exceeds 10MB limit.");
        return;
      }

      if (
        file.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setErrorMessage("Only Excel files are allowed.");
        return;
      }

      if (
        newFiles.findIndex((f) => f.name === file.name) === -1 &&
        newFiles.length < maxFile
      ) {
        newFiles.push(file);
      } else {
        setErrorMessage("Duplicate file found or maximum file limit reached.");
        return;
      }
    }

    setFiles(newFiles);
    setErrorMessage("");
  };

  const handleRemoveFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    setFilesForReques(files);
  }, [files]);

  return (
    <div style={{ textAlign: "center" }}>
      <div
        className={className}
        style={{
          border: "2px dashed #5ae4a7",
          borderRadius: "5px",
          padding: "20px",
          margin: "20px auto",
          // width: "500px",
          height: "150px",
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
          accept=".xlsx, .xls, image/*"
          multiple
          style={{ display: "none" }}
          onChange={handleFileInputChange}
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
          Drag & Drop Excel files here or click to select files
        </p>
        <span className="font-semibold" style={{ color: "#857f7f" }}>
          ( Max 1 files, Size 10MB ).
        </span>
      </div>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {files.length > 0 && (
        <div>
          <p className="font-semibold text-gray mb-4">
            Uploaded Files <SouthIcon sx={{ fontSize: "18px" }} />
          </p>
          <ul>
            {files.map((file, index) => (
              <div key={index} className="m-3 flex w-full">
                <li
                  className="w-full font-mono border rounded-full rounded-r-lg p-2"
                  style={{
                    borderColor: "rgb(212 212 216)",
                    backgroundColor: "#d7f1dc",
                    color: "#079237",
                  }}
                >
                  {file.name} - {(file.size / 1024 ** 2).toFixed(2)} MB
                </li>
                <button
                  className="ml-8 p-2 border rounded-r-full"
                  style={{
                    borderColor: "rgb(212 212 216)",
                    color: "#e66969",
                    backgroundColor: "#f9dbdb",
                  }}
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                >
                  <DeleteIcon />
                </button>
              </div>
            ))}
          </ul>
          <Button
            variant="contained"
            size="medium"
            style={{
              color: "#FFFFFF",
              background: "#5ae4a7",
              marginTop: "1rem",
            }}
            // onClick={() => navigate("/change-request")}
            // onClick={() => verifyCustomerId()}
            disabled={isLoading}
            onClick={() => handleSubmit()}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
