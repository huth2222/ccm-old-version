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
  TextField,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getAxiosCall,
  postAxiosCall,
  putAxiosCall,
} from "../../../../Utility/HelperFunction";
import dayjs from "dayjs";
import ProgressBar from "../../../CommonComponent/ProgressBar";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { postcodeValidator } from "postcode-validator";
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
  useVerifyStore,
} from "../../../../Store/createUserStore";
import { userDashboardStore } from "../../../../Store/jobDashboard";
import InternationalAddress from "./InternationalAddress";
import InputText from "../../../CommonComponent/InputText";
import CustomAutocomplete from "../../../CommonComponent/CustomAutocomplete";
import TOATransportZoneDropdown from "../../../CommonComponent/TOATransportZoneDropdown";

const GeneralInfo = ({ setCurrentIndex, verifyDataObj }) => {
  const menuList = [
    { name: "Organization", value: "organization" },
    { name: "Personal", value: "personal" },
  ];

  let { jobId, action } = useParams();
  const location = useLocation();
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
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
  const [citylist, setCityList] = useState([]);
  const [morecitylist, setMoreCityList] = useState([]);

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

  // const [countryList, setCountryList] = useState([]);
  // const [transportationZoneList, setTransportationZoneList] = useState([]);
  const [isZipValid, setIsZipValid] = useState(false);

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
  });

  const [countryId, setCountryId] = useState("");
  const [transportId, setTransportId] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "country") {
      setCountryId(value);
      const countryValue = getObjectByValue(countryList, "_id", value);
      setUserDataCollection({
        ...userDataCollection,
        country: countryValue.Description,
        countryCode: countryValue.Country,
        postalCode: "",
        city: "",
        district: "",
        subDistrict: "",
      });
    } else if (name === "transport") {
      setTransportId(value);
      const transportValue = getObjectByValue(
        transportationZoneList,
        "_id",
        value
      );
      setUserDataCollection({
        ...userDataCollection,
        transportZone: transportValue.Description,
        transportZoneCode: transportValue.TransportationZone,
      });
    } else {
      const userDataUpdate = {
        ...userDataCollection,
        [name]: value,
      };

      setUserDataCollection(userDataUpdate);
    }
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

  // Local Internatiional**
  const [userInternationalData, setUserInternationalData] = useState({
    countryCode: "",
    country: "",
    district: "",
    subDistrict: "",
    postalCode: "",
    city: "",
    region: "",
    addressLine1: "",
    street: "",
    transportZoneCode: "",
    transportZone: "",
  });

  const getIntnlTransportInfo = (transportData) => {
    setUserInternationalData({
      ...userInternationalData,
      transportZone: transportData?.Description,
      transportZoneCode: transportData?.TransportationZone,
    });
  };

  const [foreignCountryId, setForeignCountryId] = useState("");
  const [foreignTransportId, setForeignTransportId] = useState("");

  const handleInternationAddress = (e) => {
    const { name, value } = e.target;

    if (name === "country") {
      setForeignCountryId(value);
      const countryValue = getObjectByValue(countryList, "_id", value);
      setUserInternationalData({
        ...userInternationalData,
        country: countryValue.Description,
        countryCode: countryValue.Country,
        postalCode: "",
        city: "",
        district: "",
        subDistrict: "",
      });
    } else if (name === "transport") {
      // const transportValue = JSON.parse(value);
      setForeignTransportId(value);
      const transportValue = getObjectByValue(
        transportationZoneList,
        "_id",
        value
      );
      setUserInternationalData({
        ...userInternationalData,
        transportZone: transportValue.Description,
        transportZoneCode: transportValue.TransportationZone,
      });
    } else {
      const userAddress = {
        ...userInternationalData,
        [name]: value,
      };
      setUserInternationalData(userAddress);
    }
  };

  const [districtList, setDistrictList] = useState([]);
  const [subDistrictList, setSubDistrictList] = useState([]);

  const [intnlDistrictList, setIntnlDistrictList] = useState([]);
  const [IntnlSubDistrictList, setIntnlSubDistrictList] = useState([]);

  function getObjectValueByIndex(obj, index) {
    const keys = Object.keys(obj);
    const key = keys[index];
    return obj[key];
  }
  const [subdist, setSubDist] = useState({});

  const getPostalCodeData = async (code) => {
    // if (userDataCollection.countryCode !== "VN") {
    if (userDataCollection.countryCode === "TH") {
      const isPostalCodeValid = postcodeValidator(
        code,
        userDataCollection.countryCode
      );
      if (isPostalCodeValid) {
        const responseData = await postAxiosCall("data/zipcode", {
          zipcode: code,
        });
        if (responseData.status === 200) {
          const subDistrictExtracted = responseData.data.data.subdistricts;

          setDistrictList(responseData.data.data.districts);
          setSubDist(subDistrictExtracted);
          // setSubDistrictList(getObjectValueByIndex(subDistrictExtracted, 0));

          if (responseData?.data?.data?.city?.length === 1) {
            setUserDataCollection({
              ...userDataCollection,
              postalCode: code,
              city: responseData?.data?.data?.city[0],
            });
          } else {
            setUserDataCollection({
              ...userDataCollection,
              postalCode: code,
            });
          }

          setCityList(
            responseData?.data?.data?.city?.length === 1
              ? []
              : responseData?.data?.data?.city
          );
        }
      }
    }
  };

  const getTransportInfo = (transportData) => {
    setUserDataCollection({
      ...userDataCollection,
      transportZone: transportData?.Description,
      transportZoneCode: transportData?.TransportationZone,
    });
  };

  const handlePostalCode = (e) => {
    const { name, value } = e.target;
    const regex = /^[0-9\b]+$/;
    if (value === "" || regex.test(value)) {
      setIsZipValid(false);
      setUserDataCollection({
        ...userDataCollection,
        [name]: value,
        city: "",
        district: "",
        subDistrict: "",
        region: "",
        transportZone: "",
        transportZoneCode: "",
      });
      setCityList([]);
      value.length >= 5 && getPostalCodeData(value);
    }
  };

  useEffect(() => {
    if (userDataCollection.countryCode !== "VN" && subdist) {
      userDataCollection.district &&
        setSubDistrictList(subdist[userDataCollection.district]);
    }
  }, [userDataCollection.district, subdist]);

  const [intnlSubdist, setIntnlSubDist] = useState({});

  const getIntnlPostalCodeData = async (code) => {
    if (userInternationalData.countryCode === "TH" && code.length > 4) {
      const responseData = await postAxiosCall("data/zipcode", {
        zipcode: code,
      });
      if (responseData.status === 200) {
        setIntnlDistrictList(responseData.data.data.districts);
        setIntnlSubDist(responseData.data.data.subdistricts);

        if (responseData?.data?.data?.city?.length === 1) {
          setUserInternationalData({
            ...userInternationalData,
            city: responseData?.data?.data?.city[0],
          });
        } else {
          setUserInternationalData({
            ...userInternationalData,
          });
        }

        setMoreCityList(
          responseData?.data?.data?.city?.length === 1
            ? []
            : responseData?.data?.data?.city
        );
      }
    }
  };

  useEffect(() => {
    userInternationalData.district &&
      setIntnlSubDistrictList(intnlSubdist[userInternationalData.district]);
  }, [userInternationalData.district, intnlSubdist]);

  const handleIntnlPostalCode = (e) => {
    const { name, value } = e.target;
    const regex = /^[0-9\b]+$/;
    if (value === "" || regex.test(value)) {
      setIntnlDistrictList([]);
      setIntnlSubDistrictList([]);
      setUserInternationalData({
        ...userInternationalData,
        [name]: value,
        city: "",
        district: "",
        subDistrict: "",
        region: "",
        transportZone: "",
        transportZoneCode: "",
      });
    }
  };

  useEffect(() => {
    // Debouncing effect
    const getData = setTimeout(() => {
      getIntnlPostalCodeData(userInternationalData.postalCode);
    }, 800);

    return () => clearTimeout(getData);
  }, [userInternationalData.postalCode]);

  const [nameList, setNameList] = useState([{ name: "", isValid: false }]);

  const [intlNameList, setIntlNameList] = useState([
    { intlName: "", intlIsvalid: false },
  ]);

  const addMoreName = (valuetype) => {
    if (valuetype === "name") {
      setNameList([...nameList, { name: "", isValid: false }]);
    } else {
      setIntlNameList([...intlNameList, { intlName: "", intlIsvalid: false }]);
    }
  };

  const handleMultipleName = (e, key) => {
    let { name, value } = e.target;
    if (name === "name") {
      let data = [...nameList];
      data[key] = {
        [name]: value,
        isValid: value.trim()?.length > 0 ? true : false,
      };
      setNameList(data);
    } else {
      let data = [...intlNameList];
      data[key] = {
        [name]: value,
        intlIsvalid: value.trim()?.length > 0 ? true : false,
      };
      setIntlNameList(data);
    }
  };

  const handleDelete = (key, valuetype) => {
    if (valuetype === "name") {
      let data = [...nameList];
      data.splice(key, 1);
      setNameList(data);
    } else {
      let data = [...intlNameList];
      data.splice(key, 1);
      setIntlNameList(data);
    }
  };

  const getNameArray = () => {
    return Array.isArray(nameList) ? nameList?.map((obj) => obj["name"]) : [];
  };

  // payload
  const generalInfoData = {
    jobType: stateVerifyData?.jobType,
    verify: stateVerifyData ? stateVerifyData : {},
    draftIndex: 1,
    generalInfomation: {
      generalType: userDataCollection.companyType,
      originalGeneral: {
        ...userDataCollection,
        name: getNameArray(),
      },
      internationalVersionChoose: userDataCollection.addressType,
      internationalGeneral:
        userDataCollection.addressType === "differenceAddress"
          ? {
              ...userInternationalData,
              name: Array.isArray(intlNameList)
                ? intlNameList.map((obj) => obj["intlName"])
                : [],
            }
          : {},
    },
  };

  // checkValidation
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
  const isAllFieldValid = () => {
    return validateObjectIncludes(userDataCollection, includesFields);
  };

  const isAllInternationFieldValid = () => {
    return validateObjectIncludes(userInternationalData, includesFields);
  };

  const verifyData = () => {
    if (userDataCollection.addressType === "differenceAddress") {
      return isAllFieldValid() &&
        isAllInternationFieldValid() &&
        !isNameInvalid(nameList) &&
        !isNameInvalid(intlNameList) &&
        stateVerifyData.taxId
        ? true
        : false;
    } else {
      return isAllFieldValid() && !isNameInvalid(nameList) ? true : false;
    }
  };

  const verifyAndSubmitGeneralInfo = async () => {
    setIsSubmit(true);
    if (location.pathname.includes("edituser")) {
      const url = `job/submitDraftJob/${jobId}`;
      const payload = { data: generalInfoData };
      if (verifyData()) {
        setisLoading(true);
        const sendRequest = await putAxiosCall(url, payload);
        updateGeneralInfoStore(generalInfoData);
        if (sendRequest.status === 200) {
          updateJobIdInStore(sendRequest.data.id);
          // setCurrentIndex((prev) => prev + 1);
          navigate(`/edituser/addinfo/2/${jobId}`);
          setIsSubmit(false);
          setisLoading(false);
        } else {
          setIsSubmit(false);
          setisLoading(false);
        }
      }
    } else {
      const url = "job/submitFirstDraftJob";
      // setIsSubmit(true);
      if (verifyData()) {
        setisLoading(true);
        const sendRequest = await postAxiosCall(url, generalInfoData);
        updateGeneralInfoStore(generalInfoData);
        if (sendRequest.status === 200) {
          updateJobIdInStore(sendRequest.data.id);
          setCurrentIndex((prev) => prev + 1);
          setIsSubmit(false);
          setisLoading(false);
        } else {
          setIsSubmit(false);
          setisLoading(false);
        }
      }
    }
  };

  const saveData = async () => {
    if (location.pathname.includes("edituser")) {
      setIsSaveLoading(true);
      const url = `job/submitDraftJob/${jobId}`;
      const payload = {
        data: { ...generalInfoData },
      };
      const sendRequest = await putAxiosCall(url, payload);
      if (sendRequest.status === 200) {
        setIsSaveLoading(false);
        navigate("/user");
      } else {
        setIsSaveLoading(false);
      }
    } else {
      setIsSaveLoading(true);
      const url = `job/submitFirstDraftJob`;
      const sendRequest = await postAxiosCall(url, generalInfoData);
      // sendRequest.status === 200 && window.location.reload();
      if (sendRequest.status === 200) {
        setIsSaveLoading(false);
        navigate("/user");
      } else {
        setIsSaveLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (location.pathname.includes("edituser")) {
      navigate("/user");
    } else {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const updateLocalStateData = (getJobDataParams) => {
    const generalData = getJobDataParams?.generalInfomation?.originalGeneral;
    const names = generalData?.name ?? [];
    const verifyStoreData = getJobDataParams?.verify;

    setUserDataCollection({
      ...userDataCollection,
      ...generalData,
      addressType:
        getJobDataParams?.generalInfomation?.internationalVersionChoose,
      companyType: getJobDataParams?.generalInfomation?.generalType,
    });
    updateVerifyStore({
      ...verifyStoreData,
    });

    let setNameObjectFormat = names?.map((item) => {
      return { name: item, isValid: item?.trim()?.length > 0 ? true : false };
    });
    setNameList(setNameObjectFormat);
    // setNameList("nameList.concat(setNameObjectFormat)");
    if (
      getJobDataParams?.generalInfomation?.internationalVersionChoose !== "same"
    ) {
      const internationalGeneralData =
        getJobDataParams?.generalInfomation?.internationalGeneral;
      const intnlNames =
        getJobDataParams?.generalInfomation?.internationalGeneral?.name;
      setUserInternationalData({
        ...userInternationalData,
        ...internationalGeneralData,
      });
      let convertIntnlNameObjFormat = intnlNames?.map((item) => {
        return {
          intlName: item,
          intlIsvalid: item?.trim()?.length > 0 ? true : false,
        };
      });
      setIntlNameList(convertIntnlNameObjFormat);
    }
  };

  const updateCountryName = (getJobDataParams) => {
    if (jobId) {
      let getCountryId = getObjectByValue(
        countryList,
        "Country",
        getJobDataParams?.generalInfomation?.originalGeneral?.countryCode
      );
      setCountryId(getCountryId?._id);
      getPostalCodeData(
        getJobDataParams?.generalInfomation?.originalGeneral?.postalCode
      );

      if (
        getJobDataParams?.generalInfomation?.internationalVersionChoose !==
        "same"
      ) {
        let intnlCountryIds = getObjectByValue(
          countryList,
          "Country",
          getJobDataParams?.generalInfomation?.internationalGeneral?.countryCode
        );
        setForeignCountryId(intnlCountryIds?._id);
      }
    }
  };

  const updateTransportZone = (getJobDataParams) => {
    if (jobId) {
      let getTransportId = getObjectByValue(
        transportationZoneList,
        "TransportationZone",
        getJobDataParams?.generalInfomation?.originalGeneral?.transportZoneCode
      );
      setTransportId(getTransportId?._id);
      if (
        getJobDataParams?.generalInfomation?.internationalVersionChoose !==
        "same"
      ) {
        let intnlGetTransportId = getObjectByValue(
          transportationZoneList,
          "TransportationZone",
          getJobDataParams?.generalInfomation?.internationalGeneral
            ?.transportZoneCode
        );
        setForeignTransportId(intnlGetTransportId?._id);
      }
    }
  };
  const isUserCameForEdit = location.pathname.includes("edituser");
  const user = localStorage.getItem("userData");
  const parsedUserData = JSON.parse(user);
  // componentMout Effect
  useEffect(() => {
    fetchDropDownData(parsedUserData.companyCode); // Get all dropdown data.

    jobId && fetchJob(jobId); // will run only for Edit case.
  }, []);
  // getJobData;

  // useEffect for Edit Process
  useEffect(() => {
    if (isUserCameForEdit) {
      isJobLoaded && updateLocalStateData(getJobData); //GeneralState update
      isCountryLoaded && updateCountryName(getJobData);
      isTransPortDataLoaded && updateTransportZone(getJobData);
      updateJobLoadingStoreFalse();
    }
  }, [isJobLoaded, countryList, isTransPortDataLoaded]);

  const isDataInStoreNotFalse = (obj) => {
    return Object.entries(obj).length > 0;
  };

  // useEffect for handle back locally
  useEffect(() => {
    if (isDataInStoreNotFalse(getSavedPayloadFromStore) && !isUserCameForEdit) {
      userSaveJobId && updateLocalStateData(getSavedPayloadFromStore);
      userSaveJobId && updateCountryName(getSavedPayloadFromStore);
      userSaveJobId && updateTransportZone(getSavedPayloadFromStore);
    }
  }, []);

  const [vietNamCityLocal, setVietNamCityLocal] = useState([]);
  const [vietNamCityIntnl, setVietNamCityIntnl] = useState([]);
  const [vietnamDistLocal, setVietnamDistLocal] = useState([]);
  const [vietnamDistIntnl, setVietnamDistIntnl] = useState([]);

  const getVietnamCity = async (type, code) => {
    if (code === "VN") {
      const sendRequest = await getAxiosCall("data/getCityVietnam");
      if (sendRequest.status === 200) {
        if (type === "local") {
          setVietNamCityLocal(
            sendRequest.data.data?.map((item) => item.City) ?? []
          );
        } else {
          setVietNamCityIntnl(
            sendRequest.data.data?.map((item) => item.City) ?? []
          );
        }
      }
    }
  };

  useEffect(() => {
    getVietnamCity("local", userDataCollection.countryCode);
  }, [userDataCollection.countryCode]);

  useEffect(() => {
    getVietnamCity("intnl", userInternationalData.countryCode);
  }, [userInternationalData.countryCode]);

  const getVietnamDistrict = async (type, cityName) => {
    const sendRequest = await getAxiosCall(
      `data/getDistrictVietnam/${cityName}`
    );
    if (sendRequest.status === 200) {
      type === "local"
        ? setVietnamDistLocal(
            sendRequest.data.data?.map((item) => item.District) ?? []
          )
        : setVietnamDistIntnl(
            sendRequest.data.data?.map((item) => item.District) ?? []
          );
    }
  };

  useEffect(() => {
    userDataCollection.city &&
      getVietnamDistrict("local", userDataCollection.city);
  }, [userDataCollection.city]);

  useEffect(() => {
    userInternationalData.city &&
      getVietnamDistrict("Intnl", userInternationalData.city);
  }, [userInternationalData.city]);

  const getDataMasterRegionTransportZone = async () => {
    try {
      if (
        userDataCollection.postalCode?.length > 0 &&
        userDataCollection.city?.length > 0 &&
        userDataCollection.district?.length > 0 &&
        userDataCollection.subDistrict?.length > 0
      ) {
        const responseData = await postAxiosCall("data/regionTransportZone", {
          ZipCode: userDataCollection.postalCode,
          Province: userDataCollection.city,
          Amphure: userDataCollection.district,
          SubDistric: userDataCollection.subDistrict,
        });
        const cloneData = {
          ...userDataCollection,
          region: responseData?.data?.Region,
          transportZoneCode: responseData?.data?.TransportZone,
          transportZone: responseData?.data?.Descripyion,
        };
        setUserDataCollection(cloneData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getIntDataMasterRegionTransportZone = async () => {
    try {
      if (
        userInternationalData.postalCode?.length > 0 &&
        userInternationalData.city?.length > 0 &&
        userInternationalData.district?.length > 0 &&
        userInternationalData.subDistrict?.length > 0
      ) {
        const responseData = await postAxiosCall("data/regionTransportZone", {
          ZipCode: userInternationalData.postalCode,
          Province: userInternationalData.city,
          Amphure: userInternationalData.district,
          SubDistric: userInternationalData.subDistrict,
        });
        const cloneData = {
          ...userInternationalData,
          region: responseData?.data?.Region,
          transportZoneCode: responseData?.data?.TransportZone,
          transportZone: responseData?.data?.Descripyion,
        };
        setUserInternationalData(cloneData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataMasterRegionTransportZone();
  }, [
    userDataCollection.postalCode,
    userDataCollection.city,
    userDataCollection.district,
    userDataCollection.subDistrict,
  ]);

  useEffect(() => {
    getIntDataMasterRegionTransportZone();
  }, [
    userInternationalData.postalCode,
    userInternationalData.city,
    userInternationalData.district,
    userInternationalData.subDistrict,
  ]);

  return (
    <>
      <ProgressBar
        activeStepLabel={1}
        isCommentBoxVisible={
          getJobData?.isRejected || action !== "addinfo" ? true : false
        }
        getJobData={getJobData}
      />
      <div className="">
        <div className="flex justify-around lg:mx-10 xs:my-8 lg:my-8 ">
          <div className="w-4/12 lg:pl-42">
            <p className="mb-4 subpixel-antialiased font-semibold text-green lg:text-3xl">
              3. General Information
            </p>
            <p className="text-lg pl-9 text-gray">
              <span className="font-semibold ">Doc Date - </span>
              {dayjs(getJobData.createDate).format("DD/MM/YYYY : hh.mm")}
            </p>
            {getJobData?.jobNumber && (
              <p className="text-lg pl-9 text-gray">
                <span className="font-semibold">Document ID -</span>{" "}
                {getJobData.jobNumber}
              </p>
            )}
            {/* <div></div> */}
          </div>
          <div className="w-2/5">
            <p className="mb-4 ">Please fill the information.</p>
            <TextField
              className="w-full"
              size="small"
              id="user-dropdown"
              select
              label="Company Type"
              name="companyType"
              required={true}
              value={userDataCollection.companyType}
              onChange={handleChange}
              autoComplete="off"
              error={isSubmit && !userDataCollection.companyType ? true : false}
              disabled={action !== "addinfo" ? true : false}
            >
              {menuList.map((item) => {
                return (
                  <MenuItem key={item.value} value={item.value}>
                    {item.name}
                  </MenuItem>
                );
              })}
            </TextField>
            <div className="mt-4">
              {nameList.map((item, index) => {
                return (
                  <div key={index} className="flex full">
                    <TextField
                      className="w-full p-8"
                      sx={{ marginBottom: "1rem" }}
                      required
                      size="small"
                      placeholder="Please fill company's name (max 35 Characters)."
                      id="name"
                      name="name"
                      value={item.name}
                      label="Name"
                      onChange={(e) => handleMultipleName(e, index)}
                      error={isSubmit && !item.isValid ? true : false}
                      autoComplete="off"
                      inputProps={{ maxLength: 35 }}
                      disabled={action !== "addinfo" ? true : false}
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
              {nameList.length < 4 && action === "addinfo" && (
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
            <FormControl className="w-full" sx={{ marginTop: "1rem" }}>
              <InputLabel
                required={isCountryLoaded ? true : false}
                size="small"
                id="country-select-label"
              >
                {isCountryLoaded ? "Select Country" : "Loading..."}
              </InputLabel>
              <Select
                id="country-select"
                size="small"
                label="Select Country"
                name="country"
                value={countryId}
                defaultValue=""
                onChange={(e) => handleChange(e)}
                required={true}
                error={isSubmit && !userDataCollection.country ? true : false}
                disabled={action !== "addinfo" ? true : false}
              >
                {countryList?.map((countryData) => {
                  return (
                    <MenuItem key={countryData._id} value={countryData._id}>
                      {countryData.Description}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <TextField
                className="p-8"
                required
                size="small"
                placeholder="Postal Code or Zip Code"
                id="postalCode"
                name="postalCode"
                label="Postal Code"
                value={userDataCollection.postalCode}
                // onChange={(e) => handlePostalCode(e)}
                onChange={(e) =>
                  userDataCollection.countryCode === "TH"
                    ? handlePostalCode(e)
                    : handleNumberTypeChange(e)
                }
                error={
                  (userDataCollection.postalCode !== "" &&
                    !userDataCollection.country) ||
                  (isSubmit && !userDataCollection.country) ||
                  (isSubmit && !userDataCollection.postalCode)
                    ? true
                    : false
                }
                helperText={
                  userDataCollection.postalCode !== "" &&
                  !userDataCollection.country &&
                  "Select Country First."
                }
                inputProps={{ maxLength: 10 }}
                autoComplete="off"
                disabled={action !== "addinfo" ? true : false}
              />

              {userDataCollection.countryCode === "VN" ? (
                <CustomAutocomplete
                  required={true}
                  options={vietNamCityLocal ?? []}
                  label="Select City"
                  name={"city"}
                  value={
                    vietNamCityLocal.length > 0 ? userDataCollection.city : ""
                  }
                  onChange={(e) => handleChange(e)}
                  placeholder="Search or Select"
                  getOptionLabel={(option) => option}
                  isMulti={false}
                  size={"small"}
                  disabled={action !== "addinfo" ? true : false}
                />
              ) : citylist?.length > 0 ? (
                <FormControl className="w-full" sx={{ marginTop: "0rem" }}>
                  <InputLabel
                    required={isCountryLoaded ? true : false}
                    size="small"
                    id="city-select-label"
                  >
                    {isCountryLoaded ? "Select City" : "Loading..."}
                  </InputLabel>
                  <Select
                    id="city"
                    size="small"
                    label="Select City"
                    name="city"
                    value={userDataCollection.city}
                    defaultValue=""
                    onChange={(e) => handleChange(e)}
                    required={true}
                    disabled={action !== "addinfo" ? true : false}
                  >
                    {citylist?.map((cityData, city_index) => {
                      return (
                        <MenuItem key={city_index + 1} value={cityData}>
                          {cityData}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  className="p-8"
                  required
                  size="small"
                  placeholder="City"
                  id="city"
                  name="city"
                  label="City"
                  value={userDataCollection.city}
                  disabled={
                    userDataCollection.countryCode === "TH" ||
                    action !== "addinfo"
                      ? true
                      : false
                  }
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: `${
                        action === "addinfo" && "#000000"
                      }`,
                      cursor: "not-allowed",
                    },
                  }}
                  onChange={(e) => handleChange(e)}
                  error={isSubmit && !userDataCollection.city ? true : false}
                  autoComplete="off"
                  inputProps={{ maxLength: 40 }}
                  // disabled={action !== "addinfo" ? true : false}
                />
              )}

              {userDataCollection.countryCode === "TH" ? (
                <>
                  <FormControl className="w-full">
                    <InputLabel size="small" id="district-select-label">
                      Select District
                    </InputLabel>
                    <Select
                      id="district-select4"
                      size="small"
                      label="Select District"
                      name="district"
                      defaultValue=""
                      value={userDataCollection.district}
                      onChange={(e) => handleChange(e)}
                      disabled={action !== "addinfo" ? true : false}
                    >
                      {districtList.map((district) => {
                        return (
                          <MenuItem key={district} value={district}>
                            {district}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <FormControl className="w-full">
                    <InputLabel size="small" id="subdistrict-select-label">
                      Select Sub District
                    </InputLabel>
                    <Select
                      id="subdistrict-select1"
                      size="small"
                      label="Select Sub District"
                      name="subDistrict"
                      onChange={handleChange}
                      defaultValue=""
                      value={userDataCollection.subDistrict ?? ""}
                      disabled={action !== "addinfo" ? true : false}
                    >
                      {subDistrictList?.map((subDistrict) => {
                        return (
                          <MenuItem key={subDistrict} value={subDistrict}>
                            {subDistrict}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </>
              ) : (
                <>
                  {userDataCollection.countryCode === "VN" ? (
                    <CustomAutocomplete
                      required={true}
                      options={vietnamDistLocal ?? []}
                      label="Select District"
                      name={"district"}
                      value={
                        vietnamDistLocal.length > 0
                          ? userDataCollection.district
                          : ""
                      }
                      onChange={(e) => handleChange(e)}
                      placeholder="Search or Select"
                      getOptionLabel={(option) => option}
                      isMulti={false}
                      size={"small"}
                      disabled={action !== "addinfo" ? true : false}
                    />
                  ) : (
                    <TextField
                      className="p-8"
                      id="district-select1"
                      size="small"
                      label="Select District "
                      name="district"
                      onChange={(e) => handleChange(e)}
                      autoComplete="off"
                      inputProps={{ maxLength: 40 }}
                      value={userDataCollection.district}
                      disabled={action !== "addinfo" ? true : false}
                    />
                  )}

                  <TextField
                    className="p-8"
                    id="subdistrict-select2"
                    size="small"
                    label="Select Sub District"
                    name="subDistrict"
                    onChange={handleChange}
                    value={userDataCollection.subDistrict}
                    autoComplete="off"
                    inputProps={{ maxLength: 40 }}
                    disabled={action !== "addinfo" ? true : false}
                  />
                </>
              )}

              <TextField
                className="p-8"
                required
                size="small"
                placeholder="Enter Your House No."
                id="houseNO"
                name="addressLine1"
                value={userDataCollection.addressLine1}
                label="Address/House No"
                onChange={(e) => handleChange(e)}
                error={
                  isSubmit && !userDataCollection.addressLine1 ? true : false
                }
                autoComplete="off"
                inputProps={{ maxLength: 40 }}
                disabled={action !== "addinfo" ? true : false}
              />
              <TextField
                className="p-8"
                size="small"
                placeholder="Street"
                id="street"
                name="street"
                label="Street Name"
                value={userDataCollection.street}
                onChange={(e) => handleChange(e)}
                // error={isSubmit && !userDataCollection.street ? true : false}
                autoComplete="off"
                inputProps={{ maxLength: 40 }}
                disabled={action !== "addinfo" ? true : false}
              />
            </div>
            <FormControl className="w-full" sx={{ marginTop: "1rem" }}>
              <InputLabel required={true} size="small" id="region-select-label">
                Select Region
              </InputLabel>
              <Select
                id="region-select"
                size="small"
                className="w-full"
                name="region"
                label="Select Region"
                value={userDataCollection.region}
                onChange={handleChange}
                defaultValue=""
                required={true}
                error={isSubmit && !userDataCollection.region ? true : false}
                disabled={action !== "addinfo" ? true : false}
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

            <div className="mt-4">
              <TOATransportZoneDropdown
                zoneCodeValue={userDataCollection.transportZoneCode}
                getTransportData={getTransportInfo}
                needZoneCode={true}
                isEditable={true}
                disabled={action !== "addinfo" ? true : false}
                error={
                  isSubmit && !userDataCollection.transportZone ? true : false
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
              <TextField
                className="p-8"
                size="small"
                placeholder="Enter Telephone Number"
                id="telephoneNo"
                name="telephone"
                label="Telephone Number"
                value={userDataCollection.telephone}
                onChange={(e) => handleNumberTypeChange(e)}
                autoComplete="off"
                inputProps={{ maxLength: 12 }}
                disabled={action !== "addinfo" ? true : false}
              />
              <TextField
                className="p-8"
                size="small"
                placeholder="Extension Number"
                id="extensionNo"
                name="extension"
                label="Extension No"
                value={userDataCollection.extension}
                onChange={(e) => handleNumberTypeChange(e)}
                autoComplete="off"
                inputProps={{ maxLength: 10 }}
                disabled={action !== "addinfo" ? true : false}
              />
              <TextField
                className="p-8"
                size="small"
                placeholder="Enter Telephone Number"
                id="telephoneNo"
                name="telephoneSecond"
                label="Telephone Number"
                value={userDataCollection.telephoneSecond}
                onChange={(e) => handleNumberTypeChange(e)}
                autoComplete="off"
                inputProps={{ maxLength: 12 }}
                disabled={action !== "addinfo" ? true : false}
              />
              <TextField
                className="p-8"
                size="small"
                placeholder="Extension Number"
                id="extensionNo"
                name="extensionSecond"
                label="Extension No"
                value={userDataCollection.extensionSecond}
                onChange={(e) => handleNumberTypeChange(e)}
                autoComplete="off"
                inputProps={{ maxLength: 10 }}
                disabled={action !== "addinfo" ? true : false}
              />

              <TextField
                className="p-8 "
                size="small"
                placeholder="Contact Person Name"
                id="contactPerson"
                name="contactPerson"
                label="Contact Person"
                onChange={handleChange}
                value={userDataCollection.contactPerson}
                autoComplete="off"
                inputProps={{ maxLength: 50 }}
                disabled={action !== "addinfo" ? true : false}
              />

              <TextField
                className="p-8"
                size="small"
                placeholder="Mobile Phone Number"
                id="mobileNumber"
                name="mobilePhone"
                label="Mobile Phone Number"
                onChange={(e) => handleNumberTypeChange(e)}
                inputProps={{ maxLength: 12 }}
                value={userDataCollection.mobilePhone}
                autoComplete="off"
                disabled={action !== "addinfo" ? true : false}
              />
              <TextField
                className="p-8"
                size="small"
                placeholder="FAX"
                id="fax"
                name="fax"
                label="FAX No"
                onChange={(e) => handleChange(e)}
                autoComplete="off"
                inputProps={{ maxLength: 10 }}
                value={userDataCollection.fax}
                disabled={action !== "addinfo" ? true : false}
              />
              <TextField
                className="p-8"
                size="small"
                placeholder="Line ID"
                id="lineId"
                name="lineId"
                label="Line Id"
                onChange={(e) => handleChange(e)}
                autoComplete="off"
                inputProps={{ maxLength: 50 }}
                value={userDataCollection.lineId}
                disabled={action !== "addinfo" ? true : false}
              />
              <TextField
                className="p-8"
                size="small"
                placeholder="Email"
                id="emailId"
                name="email"
                label="Email Id"
                onChange={(e) => handleChange(e)}
                autoComplete="off"
                inputProps={{ maxLength: 241 }}
                value={userDataCollection.email}
                disabled={action !== "addinfo" ? true : false}
              />
              <TextField
                className="p-8"
                size="small"
                placeholder="Email"
                id="emailId"
                name="emailSecond"
                label="Email Id"
                onChange={(e) => handleChange(e)}
                // error={isSubmit && !userData.email ? true : false}
                autoComplete="off"
                value={userDataCollection.emailSecond}
                inputProps={{ maxLength: 241 }}
                disabled={action !== "addinfo" ? true : false}
              />
            </div>
            <TextField
              className="w-full p-8"
              size="medium"
              placeholder="Comment"
              id="comment"
              name="comment"
              label="Comment"
              onChange={(e) => handleChange(e)}
              value={userDataCollection.comment}
              autoComplete="off"
              inputProps={{ maxLength: 50 }}
              disabled={action !== "addinfo" ? true : false}
            />
            <FormControl component="fieldset">
              <FormLabel
                className="mt-4"
                id="addressType"
                style={{ color: "red" }}
              >
                International Address.
              </FormLabel>
              <RadioGroup
                aria-label="addressType"
                name="addressType"
                row
                aria-labelledby="addressType"
                className="mb-4"
                value={userDataCollection.addressType}
                onChange={handleChange}
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

            {/* 
            -
            -
            -
            -
                        INTERNATIONAL ADDRESS
            -
            -
            -
            */}

            {userDataCollection.addressType !== "same" && (
              <>
                <div className="mt-4">
                  {intlNameList?.map((item, index) => {
                    return (
                      <div key={index} className="flex full">
                        <TextField
                          className="w-full p-8"
                          sx={{ marginBottom: "1rem" }}
                          required
                          size="small"
                          placeholder="Please fill company's name (max 35 Characters)."
                          id="intlName"
                          name="intlName"
                          value={item.intlName}
                          label="Name"
                          onChange={(e) => handleMultipleName(e, index)}
                          error={isSubmit && !item.intlIsvalid ? true : false}
                          autoComplete="off"
                          inputProps={{ maxLength: 35 }}
                          disabled={action !== "addinfo" ? true : false}
                        />
                        {intlNameList.length > 1 && action === "addinfo" && (
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            sx={{ margin: "0 0 1rem 1rem" }}
                            onClick={() => handleDelete(index, "intlName")}
                          >
                            <DeleteIcon />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                  {intlNameList?.length < 4 && action === "addinfo" && (
                    <Button
                      sx={{
                        marginBottom: "1rem",
                        float: "right",
                      }}
                      variant="outlined"
                      size="medium"
                      onClick={() => addMoreName("intlName")}
                    >
                      <AddIcon /> Add More
                    </Button>
                  )}
                </div>

                <FormControl className="w-full" sx={{ marginTop: "1rem" }}>
                  <InputLabel
                    required={isCountryLoaded ? true : false}
                    size="small"
                    id="country-select-label-international"
                  >
                    {isCountryLoaded ? "Select Country" : "Loading..."}
                  </InputLabel>
                  <Select
                    required={true}
                    id="country-select-international"
                    size="small"
                    label="Select Country"
                    name="country"
                    value={foreignCountryId}
                    onChange={(e) => handleInternationAddress(e)}
                    defaultValue=""
                    error={
                      isSubmit && !userInternationalData.country ? true : false
                    }
                    disabled={action !== "addinfo" ? true : false}
                  >
                    {countryList.map((countryData) => {
                      return (
                        <MenuItem key={countryData._id} value={countryData._id}>
                          {countryData.Description}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {userInternationalData.countryCode === "TH" ? (
                    <TextField
                      className="p-8"
                      required
                      size="small"
                      placeholder="Postal Code or Zip Code"
                      id="postalCode"
                      name="postalCode"
                      label="Postal Code"
                      value={userInternationalData.postalCode}
                      inputProps={{ maxLength: 10 }}
                      onChange={(e) => handleIntnlPostalCode(e)}
                      autoComplete="off"
                      disabled={action !== "addinfo" ? true : false}
                    />
                  ) : (
                    <NumberInputType
                      className="p-8"
                      required
                      size="small"
                      placeholder="Postal Code or Zip Code"
                      id="postalCode"
                      name="postalCode"
                      label="Postal Code"
                      value={userInternationalData.postalCode}
                      onChange={(e) => handleInternationAddress(e)}
                      error={
                        isSubmit && !userInternationalData.country
                          ? true
                          : false
                      }
                      autoComplete="off"
                      disabled={action !== "addinfo" ? true : false}
                      inputProps={{ maxLength: 10 }}
                    />
                  )}
                  {userInternationalData.country === "Thailand" ? (
                    <>
                      {morecitylist?.length > 0 ? (
                        <FormControl
                          className="w-full"
                          sx={{ marginTop: "0rem" }}
                        >
                          <InputLabel
                            required={isCountryLoaded ? true : false}
                            size="small"
                            id="city-select-label"
                          >
                            {isCountryLoaded ? "Select City" : "Loading..."}
                          </InputLabel>
                          <Select
                            id="city"
                            size="small"
                            label="Select City"
                            name="city"
                            value={userInternationalData.city}
                            defaultValue=""
                            onChange={(e) => handleInternationAddress(e)}
                            required={true}
                            disabled={action !== "addinfo" ? true : false}
                          >
                            {morecitylist?.map((cityData, city_index) => {
                              return (
                                <MenuItem key={city_index + 1} value={cityData}>
                                  {cityData}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      ) : (
                        <TextField
                          className="p-8"
                          size="small"
                          placeholder="City"
                          id="city"
                          name="city"
                          label="City"
                          value={userInternationalData.city}
                          disabled={
                            userInternationalData.countryCode === "TH" ||
                            action !== "addinfo"
                              ? true
                              : false
                          }
                          sx={{
                            "& .MuiInputBase-input.Mui-disabled": {
                              WebkitTextFillColor: `${
                                action === "addinfo" && "#000000"
                              }`,
                              cursor: "not-allowed",
                            },
                          }}
                          autoComplete="off"
                          // disabled={action !== "addinfo" ? true : false}
                        />
                      )}
                      <FormControl className="w-full">
                        <InputLabel size="small" id="district-select-label">
                          Select District
                        </InputLabel>
                        <Select
                          id="district-select2"
                          size="small"
                          label="Select District "
                          name="district"
                          defaultValue=""
                          onChange={(e) => handleInternationAddress(e)}
                          value={userInternationalData.district}
                          disabled={action !== "addinfo" ? true : false}
                        >
                          {intnlDistrictList.map((district) => {
                            return (
                              <MenuItem key={district} value={district}>
                                {district}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>

                      <FormControl className="w-full">
                        <InputLabel size="small" id="subdistrict-select-label">
                          Select Sub District
                        </InputLabel>
                        <Select
                          id="subdistrict-select3"
                          size="small"
                          label="Select Sub District"
                          name="subDistrict"
                          onChange={handleInternationAddress}
                          value={userInternationalData.subDistrict}
                          defaultValue=""
                          disabled={action !== "addinfo" ? true : false}
                        >
                          {IntnlSubDistrictList?.map((subDistrict) => {
                            return (
                              <MenuItem key={subDistrict} value={subDistrict}>
                                {subDistrict}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </>
                  ) : (
                    <>
                      {userInternationalData.countryCode === "VN" ? (
                        <>
                          <CustomAutocomplete
                            required={true}
                            options={vietNamCityIntnl ?? []}
                            label="Select City"
                            name={"city"}
                            value={
                              vietNamCityIntnl.length > 0
                                ? userInternationalData.city
                                : ""
                            }
                            onChange={(e) => handleInternationAddress(e)}
                            placeholder="Search or Select"
                            getOptionLabel={(option) => option}
                            isMulti={false}
                            size={"small"}
                            disabled={action !== "addinfo" ? true : false}
                          />
                          <CustomAutocomplete
                            options={vietnamDistIntnl ?? []}
                            label="Select District"
                            name={"district"}
                            value={userInternationalData.district ?? ""}
                            onChange={(e) => handleInternationAddress(e)}
                            placeholder="Search or Select"
                            getOptionLabel={(option) => option}
                            isMulti={false}
                            size={"small"}
                            disabled={action !== "addinfo" ? true : false}
                          />
                        </>
                      ) : (
                        <>
                          <InputText
                            className="p-8"
                            required
                            size="small"
                            name="city"
                            label="City"
                            value={userInternationalData.city}
                            onChange={handleInternationAddress}
                            error={
                              isSubmit && !userInternationalData.city
                                ? true
                                : false
                            }
                            disabled={action !== "addinfo" ? true : false}
                            wordLength={40}
                          />
                          <InputText
                            className="p-8"
                            label="Select District "
                            name="district"
                            onChange={(e) => handleInternationAddress(e)}
                            value={userInternationalData.district}
                            disabled={action !== "addinfo" ? true : false}
                          />
                        </>
                      )}

                      <InputText
                        className="p-8"
                        label="Select Sub District"
                        name="subDistrict"
                        onChange={handleInternationAddress}
                        value={userInternationalData.subDistrict}
                        disabled={action !== "addinfo" ? true : false}
                      />
                    </>
                  )}

                  <InputText
                    className="p-8"
                    required
                    size="small"
                    name="addressLine1"
                    label="Address/House No"
                    value={userInternationalData.addressLine1}
                    onChange={(e) => handleInternationAddress(e)}
                    error={
                      isSubmit && !userInternationalData.addressLine1
                        ? true
                        : false
                    }
                    wordLength={40}
                    disabled={action !== "addinfo" ? true : false}
                  />
                  <InputText
                    className="p-8"
                    name="street"
                    label="Company's Street"
                    value={userInternationalData.street}
                    onChange={(e) => handleInternationAddress(e)}
                    wordLength={40}
                    disabled={action !== "addinfo" ? true : false}
                  />
                </div>
                <FormControl className="w-full" sx={{ marginTop: "1rem" }}>
                  <InputLabel
                    required={true}
                    size="small"
                    id="region-select-label-international"
                  >
                    Select Region
                  </InputLabel>
                  <Select
                    id="region-select-international"
                    size="small"
                    className="w-full"
                    name="region"
                    label="Select Region"
                    value={userInternationalData.region}
                    onChange={handleInternationAddress}
                    defaultValue=""
                    required={true}
                    error={
                      isSubmit && !userInternationalData.region ? true : false
                    }
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
                <div className="mt-4">
                  <TOATransportZoneDropdown
                    zoneCodeValue={userInternationalData.transportZoneCode}
                    getTransportData={getIntnlTransportInfo}
                    needZoneCode={true}
                    isEditable={true}
                    disabled={action !== "addinfo" ? true : false}
                    error={
                      isSubmit && !userInternationalData.transportZoneCode
                        ? true
                        : false
                    }
                  />
                </div>
              </>
            )}

            <div
              className="flex justify-center w-full mt-6"
              style={{ marginBottom: "6rem" }}
            >
              {action === "addinfo" ? (
                <>
                  <Button
                    sx={{
                      marginRight: "14px",
                      color: "black",
                      border: "1px solid black",
                    }}
                    variant="outlined"
                    size="medium"
                    onClick={() => handleBack()}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    size="medium"
                    sx={{ background: "gray", marginRight: "14px" }}
                    onClick={() => saveData()}
                    disabled={isSaveLoading}
                  >
                    {isSaveLoading ? "Loading..." : "Save"}
                  </Button>
                  <Button
                    variant="contained"
                    size="medium"
                    style={{ color: "#FFFFFF", background: "#5ae4a7" }}
                    onClick={() => verifyAndSubmitGeneralInfo()}
                    disabled={isLoading ? true : false}
                  >
                    {isLoading ? "Loading..." : "SAVE & NEXT"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    size="medium"
                    sx={{ background: "gray", marginRight: "14px" }}
                    onClick={() => navigate("/user")}
                  >
                    Back To Dashboard
                  </Button>

                  <Button
                    variant="contained"
                    size="medium"
                    style={{ color: "#FFFFFF", background: "#5ae4a7" }}
                    onClick={() => setCurrentIndex(2)}
                  >
                    NEXT
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GeneralInfo;
