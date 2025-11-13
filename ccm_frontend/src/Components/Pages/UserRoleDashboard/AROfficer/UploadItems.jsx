import React, { useEffect, useState } from "react";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getAxiosCall,
  postAxiosCall,
} from "../../../../Utility/HelperFunction";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export function UploadItems({ jobDataFromStore, userId }) {
  const [files, setFiles] = useState([]);

  const extractedData = jobDataFromStore.uploadItems ?? [];

  const handleDownload = async (fileUrl, fileName) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.setAttribute("download", fileName);
    a.setAttribute("target", "_blank");
    a.click();
  };

  // console.log(files);

  useEffect(() => {
    extractedData.length > 0 && setFiles(extractedData);
  }, [extractedData]);

  return (
    <div className="flex justify-around lg:mx-10 xs:my-8 lg:my-8 ">
      <div className="w-4/12 lg:pl-42">
        <p className="text-green lg:text-3xl mb-4 font-semibold subpixel-antialiased">
          Upload Item
        </p>
      </div>
      <div className="w-2/5 flex flex-col">
        {files.length < 1 ? (
          <p>Not Have File.</p>
        ) : (
          <div>
            <div className="w-full flex justify-center items-center flex-col border border-dashed border-gray rounded-md">
              {files?.map((file, index) => {
                return (
                  <div
                    key={index}
                    className="w-10/12  border-black flex items-center justify-between  mt-3 mb-3 rounded-lg"
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
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
