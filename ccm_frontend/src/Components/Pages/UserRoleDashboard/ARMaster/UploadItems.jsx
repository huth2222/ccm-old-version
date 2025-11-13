import React, { useEffect, useState } from "react";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getAxiosCall,
  postAxiosCall,
  putAxiosCallWthDataTypeJson,
} from "../../../../Utility/HelperFunction";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useParams } from "react-router-dom";
import { useUploadItemStore } from "../../../../Store/createUserStore";

export function UploadItems({ jobDataFromStore, userId }) {
  const { action } = useParams();
  const [files, setFiles] = useState([]);
  const updateUploadItemStore = useUploadItemStore(
    (state) => state.updateUploadItemsState
  );

  const extractedData = jobDataFromStore.uploadItems ?? [];

  const removefile = async (key) => {
    // console.log("clicked");
    const sendReq = await putAxiosCallWthDataTypeJson(
      `job/removeFile/${userId}/${key}`,
      {}
    );
    // console.log(sendReq);
    if (sendReq.status === 200) {
      let userFile = [...files];
      userFile.splice(key, 1);
      setFiles(userFile);
    }
  };

  const handleDownload = async (fileUrl, fileName) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.setAttribute("download", fileName);
    a.setAttribute("target", "_blank");
    a.click();
  };

  // console.log(files, userId);

  useEffect(() => {
    extractedData.length > 0 && setFiles(extractedData);
  }, [extractedData]);

  useEffect(() => {
    updateUploadItemStore(files);
  }, [files]);

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
                      </div>
                    </div>
                    {action === "addinfo" && (
                      <IconButton
                        onClick={() => removefile(index)}
                        aria-label="delete"
                        color="default"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                    <IconButton color="success">
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
