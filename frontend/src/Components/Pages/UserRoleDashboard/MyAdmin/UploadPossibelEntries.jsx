import React, { useEffect, useState } from "react";
import NavHeader from "../../../CommonComponent/NavHeader";
import TOADropdown from "../../../CommonComponent/TOADropdown";
import CustomAutocomplete from "../../../CommonComponent/CustomAutocomplete";
import {
  getAxiosCall,
  postFileUpload,
} from "../../../../Utility/HelperFunction";
import FileUpload from "../../../CommonComponent/FileUpload";
import {
  capitalizeWords,
  getObjectByValue,
} from "../../../../Utility/Constant";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function UploadPossibelEntries() {
  const navigate = useNavigate();
  const [dataList, setDataList] = useState([]);
  const [optionList, setoPtionList] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedOptionObj, setSelectedOptionObj] = useState({});
  const [urls, setUrls] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);

  const fetchDropdownData = async () => {
    const sendRequest = await getAxiosCall("data/dropdownList");
    if (sendRequest.status === 200) {
      const name = sendRequest.data.data.map((item) => item.name);
      const data = sendRequest.data.data;
      setoPtionList(name);
      setDataList(data);
    }
    // console.log(sendRequest);
  };

  const handleSelectOption = (e) => {
    // console.log(e);
    setSelectedOption(e.target.value);
  };

  const handleSubmit = async () => {
    setIsUploaded(true);
    const sendRequest = await postFileUpload(urls, files);
    console.log(sendRequest);
    if (sendRequest.status === 200) {
      // toast.success("File Uploaded Successfully.", toastClasses);
      setIsUploaded(false);
      navigate("/user");
    } else {
      setIsUploaded(false);
    }
  };

  const findObjctBySelectedOption = () => {
    const obj = getObjectByValue(dataList, "name", selectedOption);
    // console.log(obj);
    setSelectedOptionObj(obj);
    setUrls(obj.url);
  };

  const handleDownload = async (fileUrl, fileName) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.setAttribute("download", fileName);
    a.setAttribute("target", "_blank");
    a.click();
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  useEffect(() => {
    selectedOption && findObjctBySelectedOption();
  }, [selectedOption]);

  return (
    <div>
      <NavHeader
        headingText={"Upload Possible Entries"}
        fromDate={false}
        toDate={false}
        createButton={false}
        filterNeeded={false}
      />

      <p
        style={{ color: "#595151b5" }}
        className=" text-center mt-8 text-2xl font-semibold"
      >
        Upload Possible Entries In the System.
      </p>
      <div className="flex justify-around lg:mx-10 xs:my-8 lg:my-8 ">
        <div className="w-4/12 lg:pl-42">
          <p className="text-green lg:text-3xl mb-4 font-semibold subpixel-antialiased">
            1. Select Data to Update
          </p>
        </div>
        <div className="w-2/5">
          <div className="w-full ">
            <CustomAutocomplete
              options={optionList.length > 0 ? optionList : ["Loading..."]}
              label="Select Table Name"
              name={"selectedOption"}
              onChange={(e) => handleSelectOption(e)}
              placeholder="Search or Select"
              getOptionLabel={(option) => option}
              isMulti={false}
              size={"small"}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-around lg:mx-10 xs:my-8 lg:my-8 ">
        <div className="w-4/12 lg:pl-42">
          <p className="text-green lg:text-3xl mb-4 font-semibold subpixel-antialiased">
            2. Download Template.
          </p>
        </div>
        <div className="w-2/5">
          <div className="w-full"></div>
          <div className="flex items-center border rounded p-2 border-gray">
            {Object.entries(selectedOptionObj).length > 0 ? (
              <>
                <DownloadRoundedIcon
                  color="primary"
                  fontSize="medium"
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    handleDownload(
                      selectedOptionObj?.file,
                      selectedOptionObj?.name
                    )
                  }
                />
                <div className="pl-4 pr-4">
                  <p>
                    {capitalizeWords(selectedOptionObj?.name)}
                    {/* {capitalizeWords(
                      selectedOptionObj?.file?.split("/")?.join("-")
                    )} */}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-gray text-center">Select Table Name First.</p>
            )}
          </div>
          {/* {selectedOption && (
            <Button
              className="w-full"
              size="medium"
              variant="contained"
              sx={{
                backgroundColor: "#47cb4e",
              }}
              onClick={() =>
                handleDownload(selectedOptionObj.url, selectedOptionObj.file)
              }
            >
              <DownloadRoundedIcon />
              <span className="ml-4">Download Template</span>
            </Button>
          )} */}
        </div>
      </div>
      <div className="flex justify-around lg:mx-10 xs:my-8 lg:my-8 ">
        <div className="w-4/12 lg:pl-42">
          <p className="text-green lg:text-3xl mb-4 font-semibold subpixel-antialiased">
            3. Upload File
          </p>
        </div>
        <div className="w-2/5">
          {/* <div className="w-full p-8 ">
            <div className="w-full flex justify-between"></div>
            
          </div> */}
          {/* {selectedOption && ( */}
          <div className="w-full">
            <FileUpload
              className={"w-full"}
              handleSubmit={handleSubmit}
              setFilesForReques={setFiles}
              isLoading={isUploaded}
            />
          </div>
          {/* )} */}
        </div>
      </div>
    </div>
  );
}
