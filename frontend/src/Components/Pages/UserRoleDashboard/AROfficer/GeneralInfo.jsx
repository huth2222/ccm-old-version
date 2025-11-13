import React, { useEffect, useState } from "react";
import ProgressBar from "../../../CommonComponent/ProgressBar";
import dayjs from "dayjs";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import InternationalInfo from "./InternationalInfo";
import {
  putAxiosCall,
  putAxiosCallWthDataTypeJson,
} from "../../../../Utility/HelperFunction";
import { useNavigate, useParams } from "react-router-dom";
import InputText from "../../../CommonComponent/InputText";

export default function GeneralInfo({
  setCurrentIndex,
  jobDataFromStore,
  handleClickOpenWithTitle,
}) {
  const userData = localStorage.getItem("userData");
  const userParsedData = userData ? JSON.parse(userData) : {};
  const [isSubmit, setIsSubmit] = useState(false);
  const [generalData, setGeneralData] = useState({
    countryCode: "",
    country: "",
    district: "",
    subDistrict: "",
    postalCode: "",
    city: "",
    name: [],
    companyType: "",
    region: "",
    addressType: "",
    addressLine1: "",
    street: "",
    telephone: "",
    extension: "",
    telephoneSecond: "",
    extensionSecond: "",
    contactPerson: "",
    mobilePhone: "",
    fax: "",
    lineId: "",
    email: "",
    emailSecond: "",
    comment: "",
    transportZoneCode: "",
    transportZone: "",
  });
  let { userId, action } = useParams();
  const extractVerifyStateData = jobDataFromStore?.verify;
  const navigate = useNavigate();

  const [verifyStateData, setverifyStateData] = useState({
    branchCode: "",
    buyingGroup: "",
    channel: "",
    companyCode: "",
    officeType: "",
    taxId: "",
  });

  const extractedData = jobDataFromStore?.generalInfomation?.originalGeneral;

  const [addGeneralData, setAddGeneralData] = useState({
    originalSearchTerm_1: "",
    originalSearchTerm_2: "",
    internationalSearchTerm_1: "",
    internationalSearchTerm_2: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAddGeneralData({
      ...addGeneralData,
      [name]: value,
    });
  };
  // job / arSubmitUpdateJobById / 3424242423442;
  const url = `job/arSubmitUpdateJobById/${userId}`;
  const payload = { data: { generalInfomation: addGeneralData } };

  const handlePass = async () => {
    setIsSubmit(true);
    const sendRequest = await putAxiosCallWthDataTypeJson(url, payload);
    console.log(sendRequest);
    if (sendRequest.status === 200) {
      setCurrentIndex((prev) => prev + 1);
      setIsSubmit(false);
    }
  };

  // setUserDataCollection();

  useEffect(() => {
    setGeneralData({
      ...generalData,
      ...extractedData,
      addressType:
        jobDataFromStore?.generalInfomation?.internationalVersionChoose,
      companyType: jobDataFromStore?.generalInfomation?.generalType,
    });
    setverifyStateData({
      ...verifyStateData,
      ...extractVerifyStateData,
    });
    setAddGeneralData({
      ...addGeneralData,
      originalSearchTerm_1:
        jobDataFromStore?.generalInfomation?.originalSearchTerm_1 ?? "",
      originalSearchTerm_2:
        jobDataFromStore?.generalInfomation?.originalSearchTerm_2 ?? "",

      internationalSearchTerm_1:
        jobDataFromStore?.generalInfomation?.internationalSearchTerm_1 ?? "",
      internationalSearchTerm_2:
        jobDataFromStore?.generalInfomation?.internationalSearchTerm_2 ?? "",
    });
  }, [jobDataFromStore]);

  // console.log(jobDataFromStore.generalInfomation);

  return (
    <>
      <div>
        <div className="flex justify-around lg:mx-10 xs:my-8 lg:my-8 ">
          <div className="w-4/12 lg:pl-42">
            <p className="text-green lg:text-3xl mb-4 font-semibold subpixel-antialiased">
              3. General Information
            </p>
            <p className="pl-9 text-lg text-blue">
              Doc Date:{" "}
              {dayjs(jobDataFromStore?.createDate).format("DD/MM/YYYY")}
            </p>
            <p className="pl-9 text-lg text-blue">
              Document ID : {jobDataFromStore?.jobNumber}
            </p>
            {/* <div></div> */}
          </div>
          <div className="w-2/5">
            <p className="mb-4 ">Please fill the information.</p>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="officeType"
                name="officeType"
                row
                aria-labelledby="branch-row-radio-buttons-group-label"
                className="mb-4"
                value={verifyStateData.officeType || ""}
              >
                <FormControlLabel
                  value="headOffice"
                  control={<Radio color="success" />}
                  label="Head Office"
                  disabled
                />
                <FormControlLabel
                  value="branch"
                  control={<Radio color="success" />}
                  label="Branch"
                  disabled
                />
              </RadioGroup>
            </FormControl>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <InputText
                className="p-8"
                disabled={true}
                name="taxId"
                label="Tax ID"
                value={verifyStateData.taxId}
                wordLength={13}
              />
              <InputText
                className="p-8"
                disabled={true}
                name="branchCode"
                label="Branch Code"
                value={verifyStateData.branchCode}
                wordLength={5}
              />

              <InputText
                className="p-8 "
                required
                name="companyCode"
                label="Company Code"
                disabled={true}
                value={verifyStateData.companyCode}
              />
              <InputText
                className="p-8 "
                required
                name="channel"
                label="Channel"
                disabled={true}
                value={verifyStateData.channel}
              />
            </div>
            <InputText
              className="p-8 w-full"
              disabled={true}
              name="buyingGroup"
              label="Buying Group"
              value={verifyStateData.buyingGroup}
              wordLength={10}
            />
            <InputText
              className="w-full"
              mt="1rem"
              label="Business Partner Cat"
              name="companyType"
              value={generalData.companyType}
              autoComplete="off"
              disabled={true}
            />
            <div className="mt-4">
              {generalData.name.map((item, index) => {
                return (
                  <div key={index} className="full flex">
                    <TextField
                      className="p-8 w-full"
                      disabled
                      size="small"
                      placeholder="Please fill company's name (max 35 Characters)."
                      id="name"
                      name="name"
                      value={item}
                      label="Name"
                      autoComplete="off"
                      inputProps={{ maxLength: 35 }}
                      sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "#777777",
                          cursor: "not-allowed",
                        },
                        marginBottom: "1rem",
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <InputText
              className="w-full"
              label="Select Country"
              name="country"
              value={generalData.country}
              disabled={true}
            />
            <div className="grid grid-cols-2 gap-4 mt-4">
              <InputText
                className="p-8"
                name="postalCode"
                label="Postal Code"
                value={generalData.postalCode}
                wordLength={10}
                disabled={true}
              />

              <InputText
                className="p-8"
                disabled={true}
                name="city"
                label="City"
                value={generalData.city}
              />
              <InputText
                className="p-8"
                label="Select District "
                name="district"
                value={generalData.district}
                wordLength={40}
                disabled={true}
              />
              <InputText
                className="p-8"
                label="Select Sub District"
                name="subDistrict"
                value={generalData.subDistrict}
                wordLength={40}
                disabled={true}
              />
              <InputText
                className="p-8"
                name="addressLine1"
                value={generalData.addressLine1}
                label="Address/House No"
                wordLength={40}
                disabled={true}
              />
              <InputText
                className="p-8"
                name="street"
                label="Street Name"
                value={generalData.street}
                wordLength={40}
                disabled={true}
              />
            </div>
            <InputText
              className="w-full"
              mt="1rem"
              name="region"
              label="Select Region"
              value={generalData.region}
              disabled={true}
            />
            <InputText
              mt="1rem"
              className="w-full"
              label="Transportation Zone"
              name="transport"
              value={generalData.transportZone}
              disabled={true}
            />
            <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
              <InputText
                className="p-8"
                name="telephone"
                label="Telephone Number"
                value={generalData.telephone}
                wordLength={12}
                disabled={true}
              />
              <InputText
                className="p-8"
                name="extension"
                label="Extension No"
                value={generalData.extension}
                wordLength={10}
                disabled={true}
              />
              <InputText
                className="p-8"
                name="telephoneSecond"
                label="Telephone Number"
                value={generalData.telephoneSecond}
                wordLength={12}
                disabled={true}
              />
              <InputText
                className="p-8"
                name="extensionSecond"
                label="Extension No"
                value={generalData.extensionSecond}
                wordLength={10}
                disabled={true}
              />

              <InputText
                className="p-8 "
                name="contactPerson"
                label="Contact Person"
                value={generalData.contactPerson}
                wordLength={50}
                disabled={true}
              />

              <InputText
                className="p-8 "
                name="mobilePhone"
                label="Mobile Phone Number"
                value={generalData.mobilePhone}
                wordLength={12}
                disabled={true}
              />
              <InputText
                className="p-8"
                name="fax"
                label="FAX No"
                value={generalData.fax}
                wordLength={30}
                disabled={true}
              />
              <InputText
                className="p-8"
                name="lineId"
                label="Line Id"
                value={generalData.lineId}
                wordLength={50}
                disabled={true}
              />
              <InputText
                className="p-8"
                name="email"
                label="Email Id"
                value={generalData.email}
                wordLength={241}
                disabled={true}
              />
              <InputText
                className="p-8"
                name="emailSecond"
                label="Email Id"
                value={generalData.emailSecond}
                wordLength={241}
                disabled={true}
              />
              {(userParsedData?.role === "Officer" ||
                userParsedData?.role === "Assistant Manager") && (
                <>
                  <InputText
                    className="p-8"
                    autoFocus
                    name="originalSearchTerm_1"
                    label="Search Term 1"
                    onChange={(e) => handleChange(e)}
                    disabled={
                      action === "addinfo" && userParsedData?.role === "Officer"
                        ? false
                        : true
                    }
                    value={addGeneralData.originalSearchTerm_1}
                    wordLength={241}
                  />
                  <InputText
                    className="p-8"
                    name="originalSearchTerm_2"
                    label="Search Term 2"
                    onChange={(e) => handleChange(e)}
                    disabled={
                      action === "addinfo" && userParsedData?.role === "Officer"
                        ? false
                        : true
                    }
                    value={addGeneralData.originalSearchTerm_2}
                    wordLength={241}
                  />
                </>
              )}
            </div>
            <InputText
              className="p-8 w-full"
              name="comment"
              label="Comment"
              value={generalData.comment}
              autoComplete="off"
              wordLength={50}
              disabled={true}
            />
            <FormControl component="fieldset">
              <FormLabel
                className="mt-4"
                id="addressType"
                style={{ color: "blue", fontSize: "18px" }}
              >
                International Address.
              </FormLabel>
              <RadioGroup
                aria-label="addressType"
                name="addressType"
                row
                aria-labelledby="addressType"
                className="mb-4"
                value={generalData.addressType || ""}
              >
                <FormControlLabel
                  value="same"
                  control={<Radio color="success" />}
                  label="Same Address"
                  disabled
                />
                <FormControlLabel
                  value="differenceAddress"
                  control={<Radio color="success" />}
                  label="Different Address"
                  disabled
                />
              </RadioGroup>
            </FormControl>
            {generalData.addressType === "differenceAddress" && (
              <InternationalInfo
                jobDataFromStore={jobDataFromStore}
                handleIntnlDataChange={handleChange}
                inputValue={addGeneralData}
                userParsedData={userParsedData}
              />
            )}
            <div
              className="w-full flex justify-center mt-6"
              style={{ marginBottom: "6rem" }}
            >
              {action === "addinfo" ? (
                <Button
                  sx={{
                    marginRight: "14px",
                    color: "black",
                    border: "1px solid black",
                  }}
                  variant="outlined"
                  size="medium"
                  onClick={() =>
                    handleClickOpenWithTitle("Cancel/Back to Requestor Topics")
                  }
                >
                  CANCEL
                </Button>
              ) : (
                <Button
                  sx={{
                    marginRight: "14px",
                    color: "black",
                    border: "1px solid black",
                  }}
                  variant="outlined"
                  size="medium"
                  onClick={() => navigate("/user")}
                >
                  Back To Dashboard
                </Button>
              )}

              {action === "addinfo" && (
                <Button
                  variant="contained"
                  size="medium"
                  sx={{ background: "gray", marginRight: "14px" }}
                  onClick={() =>
                    handleClickOpenWithTitle("Back To Requestor Topics.")
                  }
                >
                  BACK TO REQUESTOR
                </Button>
              )}
              {action === "addinfo" && userParsedData?.role === "Officer" ? (
                <Button
                  variant="contained"
                  size="medium"
                  style={{ color: "#FFFFFF", background: "#5ae4a7" }}
                  onClick={() => handlePass()}
                  disabled={isSubmit ? true : false}
                >
                  {isSubmit ? "Loading..." : "PASS"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="medium"
                  style={{ color: "#FFFFFF", background: "#5ae4a7" }}
                  onClick={() => setCurrentIndex(1)}
                >
                  NEXT
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
