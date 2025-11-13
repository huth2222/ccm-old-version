import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";
import InternationalInfo from "./InternationalInfo";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { putAxiosCallWthDataTypeJson } from "../../../../Utility/HelperFunction";
import dayjs from "dayjs";
import ProgressBar from "../../../CommonComponent/ProgressBar";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getObjectByValue,
  isNameInvalid,
  validateObjectFields,
  validateObjectIncludes,
} from "../../../../Utility/Constant";
import { NumberInputType } from "../../../CommonComponent/NumberInputType";
import {
  fetchDataList,
  useGeneralInfoStore,
  useInternationalAddressDataStore,
  useVerifyStore,
} from "../../../../Store/createUserStore";
import { userDashboardStore } from "../../../../Store/jobDashboard";
import InputText from "../../../CommonComponent/InputText";
import CountryWithPostalCode from "../../../CommonComponent/CountryWithPostalCode";
import TOATransportZoneDropdown from "../../../CommonComponent/TOATransportZoneDropdown";
export default function GeneralInfo({
  setCurrentIndex,
  jobDataFromStore,
  handleClickOpenWithTitle,
}) {
  const menuList = [
    { name: "Organization", value: "organization" },
    { name: "Personal", value: "personal" },
  ];

  let { userId, action } = useParams();
  const location = useLocation();
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const navigate = useNavigate();
  // const user = localStorage.getItem("userData");

  // Get Data from store --++
  const getJobData = userDashboardStore((state) => state.job);
  const getSavedPayloadFromStore = useGeneralInfoStore((state) => state.data);
  const stateVerifyData = useVerifyStore((state) => state.verify);
  const userSaveJobId = useGeneralInfoStore((state) => state.id);

  // Boolean state from stroe
  const isJobLoaded = userDashboardStore((state) => state.isJobLoaded);
  const isCountryLoaded = fetchDataList((state) => state.isCountryLoaded);
  const isTransPortDataLoaded = fetchDataList(
    (state) => state.isTransPortDataLoaded
  );

  // network call from store ==
  const fetchJob = userDashboardStore((state) => state.fetchJob);

  // DataList for map ^^
  const fetchDropDownData = fetchDataList((state) => state.fetchDropDownData);
  const countryList = fetchDataList((state) => state.countryList);
  const regionList = fetchDataList((state) => state.dataRegion);
  const transportationZoneList = fetchDataList(
    (state) => state.transportZoneList
  );

  //  ___update store state ____
  const updateJobLoadingStoreFalse = userDashboardStore(
    (state) => state.setJobLoadedStateFalse
  );
  const resetJobStoreData = userDashboardStore(
    (state) => state.resetJobStoreData
  );
  const updateVerifyStore = useVerifyStore(
    (state) => state.updateVerifyDataState
  );
  const updateGeneralInfoStore = useGeneralInfoStore(
    (state) => state.updateGeneralInfoDataState
  );
  const updateJobIdInStore = useGeneralInfoStore(
    (state) => state.updateResponseJobIdState
  );

  const intnlStoreAddress = useInternationalAddressDataStore(
    (state) => state.intnlStoreAddress
  );

  // const [isZipValid, setIsZipValid] = useState(false);

  // Local General**
  const [userDataCollection, setUserDataCollection] = useState({
    countryCode: "",
    country: "",
    district: "",
    subDistrict: "",
    postalCode: "",
    city: "",
    companyType: "",
    region: "",
    addressType: "same",
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
    originalSearchTerm_1: "",
    originalSearchTerm_2: "",
    internationalSearchTerm_1: "",
    internationalSearchTerm_2: "",
    note1: "",
    note2: "",
    note3: "",
    note4: "",
  });

  const extractVerifyStateData = jobDataFromStore?.verify;
  const [verifyStateData, setverifyStateData] = useState({
    branchCode: "",
    buyingGroup: "",
    channel: "",
    companyCode: "",
    officeType: "",
    taxId: "",
  });

  const extractedGeneralData =
    jobDataFromStore?.generalInfomation?.originalGeneral;
  // console.log(extractedGeneralData);

  const [transportId, setTransportId] = useState("");

  const getCountriesInfo = (countries) => {
    // console.log("get countries Data", countries);
    setUserDataCollection({
      ...userDataCollection,
      country: countries?.countryObj?.Description,
      countryCode: countries?.countryObj?.Country,
      salesDistrict: countries.district,
      salesSubDistrict: countries.subDistrict,
      city: countries.city,
      postalCode: countries.postalCode,
    });
  };

  const getTransportInfo = (transportData) => {
    // console.log("get Transport Data", transportData);
    setUserDataCollection({
      ...userDataCollection,
      transportZone: transportData?.Description,
      transportZoneCode: transportData?.TransportationZone,
    });
  };

  const [nameList, setNameList] = useState([{ name: "", isValid: false }]);

  const addMoreName = (valuetype) => {
    if (valuetype === "name") {
      setNameList([...nameList, { name: "", isValid: false }]);
    }
  };

  const handleMultipleName = (e, key) => {
    const { name, value } = e.target;
    if (name === "name") {
      let data = [...nameList];
      data[key] = {
        [name]: value,
        isValid: value.length > 0 ? true : false,
      };
      setNameList(data);
    }
  };

  const handleDelete = (key, valuetype) => {
    if (valuetype === "name") {
      let data = [...nameList];
      data.splice(key, 1);
      setNameList(data);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const userDataUpdate = {
      ...userDataCollection,
      [name]: value,
    };

    setUserDataCollection(userDataUpdate);
  };
  const handleNumberTypeChange = (e) => {
    const { name, value } = e.target;
    const regex = /^[0-9\b]+$/;
    if (value === "" || regex.test(value)) {
      const userDataUpdate = {
        ...userDataCollection,
        [name]: value,
      };

      setUserDataCollection(userDataUpdate);
    }
  };

  const payloadData = {
    data: {
      jobType: stateVerifyData?.jobType,
      verify: verifyStateData,
      draftIndex: 1,
      generalInfomation: {
        generalType: userDataCollection.companyType,
        originalGeneral: {
          name: nameList?.map((obj) => obj["name"]),
          ...userDataCollection,
        },
        internationalVersionChoose: userDataCollection.addressType,
        internationalGeneral:
          userDataCollection.addressType === "differenceAddress"
            ? {
                ...intnlStoreAddress,
              }
            : {},
        originalSearchTerm_1: userDataCollection?.originalSearchTerm_1,
        originalSearchTerm_2: userDataCollection?.originalSearchTerm_2,
        internationalSearchTerm_1: intnlStoreAddress?.internationalSearchTerm_1,
        internationalSearchTerm_2: intnlStoreAddress?.internationalSearchTerm_2,
      },
    },
  };

  // checkValidation
  const isGenFieldValid = () => {
    const includesFields = [
      "countryCode",
      "country",
      "postalCode",
      "city",
      "addressLine1",
      "transportZoneCode",
      "transportZone",
      "region",
    ];
    return validateObjectIncludes(userDataCollection, includesFields);
  };

  const isIntnlFieldValid = () => {
    const excluedFields = [
      "countryCode",
      "country",
      "postalCode",
      "city",
      "addressLine1",
      "transportZoneCode",
      "transportZone",
      "region",
    ];
    // console.log(intnlStoreAddress);
    return validateObjectIncludes(intnlStoreAddress, excluedFields);
  };

  const [customerId, setCustomerId] = useState("");

  const handleCustomerIdChange = (e) => {
    const regex = /^[0-9\b]+$/;
    if (e.target.value === "" || regex.test(e.target.value)) {
      setCustomerId(e.target.value);
    }
  };

  const postCustomerId = async () => {
    setIsSubmit(true);
    if (customerId) {
      const url = `job/submitCustomerId/${userId}`;
      const payload = {
        data: {
          customerId: customerId,
        },
      };
      // console.log(url, payload);
      const request = await putAxiosCallWthDataTypeJson(url, payload);
      if (request.status === 200) {
        // console.log(request);
        setIsSubmit(false);
        navigate("/user");
      } else {
        setIsSubmit(false);
      }
    }
  };

  const verifyData = () => {
    if (userDataCollection.addressType === "differenceAddress") {
      return isGenFieldValid() &&
        !isNameInvalid(nameList) &&
        isIntnlFieldValid() &&
        verifyStateData.taxId
        ? true
        : false;
    } else {
      return isGenFieldValid() && !isNameInvalid(nameList) ? true : false;
    }
  };

  const updateNameLIst = () => {
    const names = jobDataFromStore?.generalInfomation?.originalGeneral?.name;
    let setNameObjectFormat = names?.map((item) => {
      return { name: item, isValid: true };
    });
    setNameList(setNameObjectFormat);
  };

  const url = `job/arSubmitUpdateJobById/${userId}`;

  const handlePass = async () => {
    setIsSubmit(true);
    if (verifyData()) {
      let newName = [];
      if (nameList?.length > 0) {
        nameList?.map((item) => {
          newName.push(item?.name);
        });
      }
      // update name
      let cloneData = { ...payloadData };
      cloneData.data.generalInfomation.originalGeneral.name = newName;
      const sendRequest = await putAxiosCallWthDataTypeJson(url, cloneData);
      // console.log("API Response", sendRequest);
      if (sendRequest.status === 200) {
        setCurrentIndex((prev) => prev + 1);
        setIsSubmit(false);
      } else {
        setIsSubmit(false);
      }
    }
  };
  // const user = localStorage.getItem("userData");
  // const parsedUserData = JSON.parse(user);

  useEffect(() => {
    verifyStateData.companyCode &&
      fetchDropDownData(verifyStateData.companyCode); // Get all dropdown data.
    userId && fetchJob(userId); // will run only for Edit case.
  }, [verifyStateData.companyCode]);

  useEffect(() => {
    setUserDataCollection({
      ...userDataCollection,
      ...extractedGeneralData,
      addressType:
        jobDataFromStore?.generalInfomation?.internationalVersionChoose,
      companyType: jobDataFromStore?.generalInfomation?.generalType,
      originalSearchTerm_1:
        jobDataFromStore?.generalInfomation?.originalSearchTerm_1 ?? "",
      originalSearchTerm_2:
        jobDataFromStore?.generalInfomation?.originalSearchTerm_2 ?? "",
    });
    setverifyStateData({
      ...verifyStateData,
      ...extractVerifyStateData,
    });
    updateNameLIst(jobDataFromStore);
    setCustomerId(jobDataFromStore.customerId);
  }, [jobDataFromStore]);

  // console.log("00000000", {
  //   jobDataFromStore,
  //   intnlStoreAddress,
  // userDataCollection,
  //   verifyData,
  // });

  return (
    <>
      <div>
        <div className="flex justify-around lg:mx-10 xs:my-8 lg:my-8 ">
          <div className="w-4/12 lg:pl-42">
            <p className="mb-4 subpixel-antialiased font-semibold text-green lg:text-3xl">
              3. General Information
            </p>
            <p className="text-lg pl-9 text-blue">
              Doc Date:{" "}
              {dayjs(jobDataFromStore?.createDate).format("DD/MM/YYYY")}
            </p>
            <p className="text-lg pl-9 text-blue">
              Document ID : {jobDataFromStore?.jobNumber}
            </p>
            {/* <div></div> */}
          </div>
          <div className="w-2/5">
            <p className="mb-4 ">Please fill the information.</p>
            {action === "view" && (
              <div className="p-4 mb-4 border rounded">
                <InputText
                  className="w-full p-8"
                  size="small"
                  autoFocus
                  label="Customer ID."
                  value={customerId}
                  onChange={(e) => handleCustomerIdChange(e)}
                  wordLength={10}
                  disabled={!jobDataFromStore?.isCompleted ? false : true}
                  error={isSubmit && !customerId ? true : false}
                />
                {!jobDataFromStore?.customerId &&
                  !jobDataFromStore?.isCompleted && (
                    <div className="flex justify-end mt-4">
                      <Button
                        sx={{
                          float: "right",
                        }}
                        variant="contained"
                        size="medium"
                        onClick={() => postCustomerId()}
                      >
                        Submit
                      </Button>
                    </div>
                  )}
              </div>
            )}
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="officeType"
                name="officeType"
                row
                aria-labelledby="branch-row-radio-buttons-group-label"
                className="mb-4"
                value={verifyStateData.officeType}
              >
                <FormControlLabel
                  value="headOffice"
                  control={<Radio color="success" />}
                  label="Head Office"
                  disabled={true}
                />
                <FormControlLabel
                  value="branch"
                  control={<Radio color="success" />}
                  label="Branch"
                  disabled={true}
                />
              </RadioGroup>
            </FormControl>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <InputText
                className="p-8"
                disabled
                size="small"
                label="Tax ID"
                value={verifyStateData.taxId}
              />
              <InputText
                className="p-8"
                disabled
                size="small"
                label="Branch Code"
                value={verifyStateData.branchCode}
              />

              <InputText
                className="p-8 "
                size="small"
                label="Company Code"
                disabled={true}
                value={verifyStateData.companyCode}
              />
              <InputText
                className="p-8 "
                size="small"
                label="Channel"
                disabled={true}
                value={verifyStateData.channel}
              />
            </div>
            <InputText
              className="w-full p-8"
              disabled
              size="small"
              label="Buying Group"
              value={verifyStateData.buyingGroup}
            />
            <FormControl className="w-full" sx={{ marginTop: "1rem" }}>
              <InputLabel value="" size="small">
                Company Type
              </InputLabel>
              <Select
                size="small"
                label="Company Type"
                name="companyType"
                value={userDataCollection.companyType}
                onChange={(e) => handleChange(e)}
                error={
                  isSubmit && !userDataCollection.companyType ? true : false
                }
                disabled={action !== "addinfo" ? true : false}
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "#777777",
                    cursor: "not-allowed",
                  },
                }}
              >
                {menuList.map((item) => {
                  return (
                    <MenuItem key={item.value} value={item.value}>
                      {item.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <div className="mt-4">
              {nameList?.map((item, index) => {
                return (
                  <div key={index} className="flex full">
                    <InputText
                      className="w-full p-8"
                      required
                      size="small"
                      name="name"
                      value={item.name}
                      label="Name"
                      onChange={(e) => handleMultipleName(e, index)}
                      error={isSubmit && !item.isValid ? true : false}
                      wordLength={35}
                      disabled={action !== "addinfo" ? true : false}
                      sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "#777777",
                          cursor: "not-allowed",
                        },
                        marginBottom: "1rem",
                      }}
                    />
                    {nameList.length > 1 && action === "addinfo" && (
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        sx={{ margin: "0 0 1rem 1rem" }}
                        onClick={() => handleDelete(index, "name")}
                      >
                        <DeleteIcon />
                      </Button>
                    )}
                  </div>
                );
              })}
              {nameList?.length < 4 && action === "addinfo" && (
                <Button
                  sx={{
                    marginBottom: "1rem",
                    float: "right",
                  }}
                  variant="outlined"
                  size="medium"
                  onClick={() => addMoreName("name")}
                >
                  <AddIcon /> Add More
                </Button>
              )}
            </div>
            {isCountryLoaded && (
              <CountryWithPostalCode
                getCountriesData={getCountriesInfo}
                countryCode={userDataCollection.countryCode}
                postalValue={userDataCollection.postalCode}
                cityValue={userDataCollection.city}
                districtValue={userDataCollection.district}
                subDistrictValue={userDataCollection.subDistrict}
                isEditable={true}
                isSubmit={isSubmit}
              />
            )}

            <div className="grid grid-cols-2 gap-4 mt-4">
              <InputText
                className="p-8"
                required
                size="small"
                name="addressLine1"
                value={userDataCollection.addressLine1}
                label="Address/House No"
                onChange={(e) => handleChange(e)}
                error={
                  isSubmit && !userDataCollection.addressLine1 ? true : false
                }
                wordLength={40}
                disabled={action !== "addinfo" ? true : false}
              />
              <InputText
                className="p-8"
                size="small"
                name="street"
                label="Street Name"
                value={userDataCollection.street}
                onChange={(e) => handleChange(e)}
                wordLength={40}
                disabled={action !== "addinfo" ? true : false}
              />
            </div>
            <FormControl
              className="w-full"
              sx={{ marginTop: "1rem", marginBottom: "1rem" }}
            >
              <InputLabel required={true} size="small" id="region-select-label">
                Select Region
              </InputLabel>
              <Select
                size="small"
                className="w-full"
                name="region"
                label="Select Region"
                value={userDataCollection.region}
                onChange={(e) => handleChange(e)}
                defaultValue=""
                required={true}
                error={isSubmit && !userDataCollection.region ? true : false}
                disabled={action !== "addinfo" ? true : false}
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "#777777",
                    cursor: "not-allowed",
                  },
                }}
              >
                {regionList.map((region) => {
                  return (
                    <MenuItem key={region._id} value={region.Region}>
                      {region.Description}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            {isTransPortDataLoaded && (
              <TOATransportZoneDropdown
                zoneCodeValue={userDataCollection.transportZoneCode}
                getTransportData={getTransportInfo}
                isEditable={true}
                error={
                  isSubmit && !userDataCollection.transportZoneCode
                    ? true
                    : false
                }
                disabled={action !== "addinfo" ? true : false}
              />
            )}

            <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
              <InputText
                className="p-8"
                name="telephone"
                label="Telephone Number"
                value={userDataCollection.telephone}
                onChange={(e) => handleNumberTypeChange(e)}
                wordLength={12}
                disabled={action !== "addinfo" ? true : false}
              />
              <InputText
                className="p-8"
                name="extension"
                label="Extension No"
                value={userDataCollection.extension}
                onChange={(e) => handleNumberTypeChange(e)}
                wordLength={12}
                disabled={action !== "addinfo" ? true : false}
              />
              <InputText
                className="p-8"
                name="telephoneSecond"
                label="Telephone Number"
                value={userDataCollection.telephoneSecond}
                onChange={(e) => handleNumberTypeChange(e)}
                wordLength={12}
                disabled={action !== "addinfo" ? true : false}
              />
              <InputText
                className="p-8"
                name="extensionSecond"
                label="Extension No"
                value={userDataCollection.extensionSecond}
                onChange={(e) => handleNumberTypeChange(e)}
                wordLength={10}
                disabled={action !== "addinfo" ? true : false}
              />

              <InputText
                className="p-8 "
                name="contactPerson"
                label="Contact Person"
                value={userDataCollection.contactPerson}
                onChange={(e) => handleChange(e)}
                wordLength={50}
                disabled={action !== "addinfo" ? true : false}
              />

              <InputText
                className="p-8 "
                name="mobilePhone"
                label="Mobile Phone Number"
                value={userDataCollection.mobilePhone}
                onChange={(e) => handleNumberTypeChange(e)}
                wordLength={12}
                disabled={action !== "addinfo" ? true : false}
              />
              <InputText
                className="p-8"
                name="fax"
                label="FAX No"
                onChange={(e) => handleChange(e)}
                value={userDataCollection.fax}
                wordLength={30}
                disabled={action !== "addinfo" ? true : false}
              />
              <InputText
                className="p-8"
                name="lineId"
                label="Line Id"
                onChange={(e) => handleChange(e)}
                value={userDataCollection.lineId}
                wordLength={50}
                disabled={action !== "addinfo" ? true : false}
              />
              <InputText
                className="p-8"
                name="email"
                label="Email Id"
                onChange={(e) => handleChange(e)}
                value={userDataCollection.email}
                wordLength={230}
                disabled={action !== "addinfo" ? true : false}
              />
              <InputText
                className="p-8"
                name="emailSecond"
                label="Email Id"
                onChange={(e) => handleChange(e)}
                value={userDataCollection.emailSecond}
                wordLength={230}
                disabled={action !== "addinfo" ? true : false}
              />
              <InputText
                className="p-8"
                size="small"
                name="originalSearchTerm_1"
                label="Search Term 1"
                value={userDataCollection.originalSearchTerm_1}
                onChange={(e) => handleChange(e)}
                wordLength={200}
                disabled={action !== "addinfo" ? true : false}
              />
              <InputText
                className="p-8"
                size="small"
                name="originalSearchTerm_2"
                label="Search Term 2"
                value={userDataCollection.originalSearchTerm_2}
                onChange={(e) => handleChange(e)}
                wordLength={200}
                disabled={action !== "addinfo" ? true : false}
              />
              <InputText
                className="p-8"
                size="small"
                name="note1"
                label="Note 1"
                value={userDataCollection.note1}
                onChange={(e) => handleChange(e)}
                wordLength={200}
                disabled={action !== "addinfo" ? true : false}
              />
              <InputText
                className="p-8"
                size="small"
                name="note2"
                label="Note 2"
                value={userDataCollection.note2}
                onChange={(e) => handleChange(e)}
                wordLength={200}
                disabled={action !== "addinfo" ? true : false}
              />
              <InputText
                className="p-8"
                size="small"
                name="note3"
                label="Note 3"
                value={userDataCollection.note3}
                onChange={(e) => handleChange(e)}
                wordLength={240}
                disabled={action !== "addinfo" ? true : false}
              />
              <InputText
                className="p-8"
                size="small"
                name="note4"
                label="Note 4"
                value={userDataCollection.note4}
                onChange={(e) => handleChange(e)}
                wordLength={240}
                disabled={action !== "addinfo" ? true : false}
              />
            </div>
            <InputText
              className="w-full p-8"
              size="medium"
              name="comment"
              label="Comment"
              value={userDataCollection.comment}
              onChange={(e) => handleChange(e)}
              wordLength={50}
              disabled={action !== "addinfo" ? true : false}
            />

            <FormControl component="fieldset">
              <FormLabel className="mt-4" style={{ color: "red" }}>
                International Address.
              </FormLabel>
              <RadioGroup
                name="addressType"
                row
                className="mb-4"
                value={userDataCollection.addressType}
                onChange={handleChange}
                // disabled={action !== "addinfo" ? true : false}
              >
                <FormControlLabel
                  value="same"
                  control={<Radio color="success" />}
                  label="Same Address"
                  disabled={action !== "addinfo" ? true : false}
                />
                <FormControlLabel
                  value="differenceAddress"
                  control={<Radio color="success" />}
                  label="Different Address"
                  disabled={action !== "addinfo" ? true : false}
                />
              </RadioGroup>
            </FormControl>
            {userDataCollection.addressType === "differenceAddress" && (
              <InternationalInfo
                jobDataFromStore={jobDataFromStore}
                isSubmit={isSubmit}
              />
            )}
            <div
              className="flex justify-center w-full mt-6"
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
              {action === "view" ? (
                <Button
                  variant="contained"
                  size="medium"
                  style={{ color: "#FFFFFF", background: "#5ae4a7" }}
                  onClick={() => setCurrentIndex(1)}
                >
                  NEXT
                </Button>
              ) : (
                action === "addinfo" && (
                  <Button
                    variant="contained"
                    size="medium"
                    style={{ color: "#FFFFFF", background: "#5ae4a7" }}
                    onClick={() => handlePass()}
                    disabled={isSubmit ? true : false}
                  >
                    {isSubmit ? "Loading.." : "PASS"}
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
