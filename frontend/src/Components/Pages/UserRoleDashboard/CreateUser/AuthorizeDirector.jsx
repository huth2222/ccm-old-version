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
import { useEffect, useState } from "react";
import MyDatePicker from "../../../CommonComponent/MyDatePicker";
import dayjs from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { NumberInputType } from "../../../CommonComponent/NumberInputType";
import {
  fetchDataList,
  useAuthorizeStore,
  useUserDataStore,
} from "../../../../Store/createUserStore";
import { postcodeValidator } from "postcode-validator";
import {
  getAxiosCall,
  postAxiosCall,
} from "../../../../Utility/HelperFunction";
import { userDashboardStore } from "../../../../Store/jobDashboard";
import { useParams } from "react-router-dom";
import { getObjectByValue } from "../../../../Utility/Constant";
import CustomAutocomplete from "../../../CommonComponent/CustomAutocomplete";
import TOATransportZoneDropdown from "../../../CommonComponent/TOATransportZoneDropdown";

export function AuthorizeDirector() {
  const isSubmit = useUserDataStore((state) => state.isSubmited);
  let { jobId, action } = useParams();

  const countryList = fetchDataList((state) => state.countryList);
  const transPortList = fetchDataList((state) => state.transportZoneList);
  const regionList = fetchDataList((state) => state.dataRegion);
  const genderList = fetchDataList((state) => state.dataGender);
  const [citylist, setCityList] = useState([]);
  const updateAuthorizeStore = useAuthorizeStore(
    (state) => state.updateAuthorizeDataState
  );
  const updateJobLoadingStoreFalse = userDashboardStore(
    (state) => state.setJobLoadedStateFalse
  );

  const isJobDataLoadedFromAPI = userDashboardStore(
    (state) => state.isJobLoaded
  );
  const isCountryLoaded = fetchDataList((state) => state.isCountryLoaded);
  const isTransPortDataLoaded = fetchDataList(
    (state) => state.isTransPortDataLoaded
  );

  const fetchJob = userDashboardStore((state) => state.fetchJob);
  const getJobData = userDashboardStore((state) => state.job);

  const [countryId, setCountryId] = useState("");
  const [transportId, setTransportId] = useState("");

  const [authDirectorData, setAuthDirectorData] = useState([
    {
      firstName: "",
      lastName: "",
      countryId: "",
      countryCode: "",
      country: "",
      postalCode: "",
      city: "",
      salesDistrict: "",
      salesSubDistrict: "",
      houseNo: "",
      companyStreet: "",
      region: "",
      transportZoneCode: "",
      transportZone: "",
      gender: "",
      taxId: "",
      dateOfBirth: "",
      districtList: [],
      subdistList: [],
      cityList: [],
      // dateOfBirth: "1985-09-30",
    },
  ]);

  const handleDateChange = (date, index) => {
    const dateFormated = dayjs(date).format("DD.MM.YYYY");
    let cloneData = [...authDirectorData];
    cloneData[index] = {
      ...cloneData[index],
      dateOfBirth: dateFormated,
    };
    setAuthDirectorData(cloneData);
  };

  const handleChange = async (e, index, item) => {
    const { name, value } = e.target;
    if (name === "country") {
      setCountryId(value);
      const countryValue = getObjectByValue(countryList, "_id", value);
      let cloneData = [...authDirectorData];
      cloneData[index] = {
        ...cloneData[index],
        countryId: countryValue._id,
        country: countryValue.Description,
        countryCode: countryValue.Country,
        postalCode: "",
        city: "",
      };
      setAuthDirectorData(cloneData);
    } else if (name === "transport") {
      setTransportId(value);
      const transportValue = getObjectByValue(transPortList, "_id", value);
      let cloneData = [...authDirectorData];
      cloneData[index] = {
        ...cloneData[index],
        transportZone: transportValue.Description,
        transportZoneCode: transportValue.TransportationZone,
      };
      setAuthDirectorData(cloneData);
    } else if (name === "salesDistrict") {
      let cloneData = [...authDirectorData];
      cloneData[index] = {
        ...cloneData[index],
        [name]: value,
      };
      setAuthDirectorData(cloneData);
      setSubDistrictList(item?.subdistList[value]);
    } else if (name === "salesSubDistrict") {
      const responseData = await postAxiosCall("data/regionTransportZone", {
        ZipCode: item?.postalCode,
        Province: item?.city,
        Amphure: item?.salesDistrict,
        SubDistric: value,
      });
      let cloneData = [...authDirectorData];
      cloneData[index] = {
        ...cloneData[index],
        [name]: value,
        region: responseData?.data?.Region,
        transportZoneCode: responseData?.data?.TransportZone,
        transportZone: responseData?.data?.Descripyion,
      };
      setAuthDirectorData(cloneData);
    } else if (name === "city" && item?.countryCode === "VN") {
      let cloneData = [...authDirectorData];
      cloneData[index] = {
        ...cloneData[index],
        [name]: value,
      };
      setAuthDirectorData(cloneData);
      const sendRequest = await getAxiosCall(
        `data/getDistrictVietnam/${value}`
      );
      if (sendRequest.status === 200) {
        setVietnamDistLocal(sendRequest.data.data);
      }
    } else {
      let cloneData = [...authDirectorData];
      cloneData[index] = {
        ...cloneData[index],
        [name]: value,
      };
      setAuthDirectorData(cloneData);
    }
  };

  const getTransportInfo = (transportData, index) => {
    let cloneData = [...authDirectorData];
    cloneData[index] = {
      ...cloneData[index],
      transportZone: transportData?.Description,
      transportZoneCode: transportData?.TransportationZone,
    };
    setAuthDirectorData(cloneData);
  };

  const [districtList, setDistrictList] = useState([]);
  const [subDistrictList, setSubDistrictList] = useState([]);

  function getObjectValueByIndex(obj, index) {
    const keys = Object.keys(obj);
    const key = keys[index];
    return obj[key];
  }

  const [subdist, setSubDist] = useState({});

  const handlePostalCode = async (e, index, item) => {
    const { name, value } = e.target;
    const regex = /^[0-9\b]+$/;
    if (value === "" || regex.test(value)) {
      let cloneData = [...authDirectorData];
      cloneData[index] = {
        ...cloneData[index],
        [name]: value,
        city: "",
        salesDistrict: "",
        salesSubDistrict: "",
        region: "",
        transportZone: "",
        transportZoneCode: "",
      };
      setAuthDirectorData(cloneData);
      item.cityList = [];

      if (item?.countryCode === "TH" && value.length > 4) {
        const responseData = await postAxiosCall("data/zipcode", {
          zipcode: value,
        });
        if (responseData.status === 200) {
          if (responseData?.data?.data?.city?.length === 1) {
            let cloneMock = [...cloneData];
            cloneMock[index] = {
              ...cloneMock[index],
              city: responseData?.data?.data?.city[0],
              postalCode: value,
              districtList: responseData.data.data.districts,
              subdistList: responseData.data.data.subdistricts,
              cityList:
                responseData?.data?.data?.city?.length === 1
                  ? []
                  : responseData?.data?.data?.city,
            };
            setAuthDirectorData(cloneMock);
          } else {
            let cloneMock = [...cloneData];
            cloneMock[index] = {
              ...cloneMock[index],
              postalCode: value,
              districtList: responseData.data.data.districts,
              subdistList: responseData.data.data.subdistricts,
              cityList:
                responseData?.data?.data?.city?.length === 1
                  ? []
                  : responseData?.data?.data?.city,
            };
            setAuthDirectorData(cloneMock);
          }
        }
      }
    }
  };

  const handleNumber = async (e, index, item) => {
    const { name, value } = e.target;
    const regex = /^[0-9\b]+$/;
    if (value === "" || regex.test(value)) {
      let cloneData = [...authDirectorData];
      cloneData[index] = {
        ...cloneData[index],
        [name]: value,
      };
      setAuthDirectorData(cloneData);
    }

    if (item?.countryCode === "VN") {
      const sendRequest = await getAxiosCall("data/getCityVietnam");
      if (sendRequest.status === 200) {
        setVietNamCityLocal(sendRequest.data.data);
      }
    }
  };

  const updateLocalStateForEdit = (salesParamsJobData) => {
    const extractedData = salesParamsJobData.authorizeDirector
      ? salesParamsJobData.authorizeDirector
      : {};
    setAuthDirectorData(extractedData);
    updateJobLoadingStoreFalse();
  };

  const isUserCameForEdit = location.pathname.includes("edituser");

  const updateCountryName = (getJobDataParams) => {
    if (isUserCameForEdit) {
      let getCountryId = getObjectByValue(
        countryList,
        "Country",
        getJobDataParams?.authorizeDirector?.countryCode
      );
      setCountryId(getCountryId?._id);
    }
  };

  const updateTransportZone = (getJobDataParams) => {
    if (isUserCameForEdit) {
      let getTransportId = getObjectByValue(
        transPortList,
        "TransportationZone",
        getJobDataParams?.authorizeDirector?.transportZoneCode
      );
      setTransportId(getTransportId?._id);
    }
  };

  useEffect(() => {
    !isJobDataLoadedFromAPI && jobId && fetchJob(jobId);
  }, []);

  useEffect(() => {
    updateAuthorizeStore(authDirectorData);
  }, [authDirectorData]);

  // Edit User Effect
  useEffect(() => {
    isJobDataLoadedFromAPI && updateLocalStateForEdit(getJobData);
    isCountryLoaded && updateCountryName(getJobData);
    isTransPortDataLoaded && updateTransportZone(getJobData);
  }, [
    isJobDataLoadedFromAPI,
    isTransPortDataLoaded,
    isTransPortDataLoaded,
    getJobData,
  ]);

  const [vietNamCityLocal, setVietNamCityLocal] = useState([]);
  const [vietnamDistLocal, setVietnamDistLocal] = useState([]);

  const formatBirth = (data) => {
    try {
      if (data?.length > 0) {
        const newDate = data.split(".");
        return dayjs(newDate[2] + "-" + newDate[1] + "-" + newDate[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addMoreAuthorizeDirector = () => {
    try {
      let cloneData = [...authDirectorData];
      cloneData.push({
        firstName: "",
        lastName: "",
        countryId: "",
        countryCode: "",
        country: "",
        postalCode: "",
        city: "",
        salesDistrict: "",
        salesSubDistrict: "",
        houseNo: "",
        companyStreet: "",
        region: "",
        transportZoneCode: "",
        transportZone: "",
        gender: "",
        taxId: "",
        dateOfBirth: "",
        districtList: [],
        subdistList: [],
        cityList: [],
        // dateOfBirth: "1985-09-30",
      });
      setAuthDirectorData(cloneData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (key) => {
    let data = [...authDirectorData];
    data.splice(key, 1);
    setAuthDirectorData(data);
  };

  // console.log("authDirectorData", authDirectorData);

  const getData = async () => {
    try {
      if (action === "view") {
        if (authDirectorData?.length > 0) {
          // eslint-disable-next-line no-unused-vars
          for await (const [index, item] of authDirectorData.entries()) {
            if (item?.countryCode === "TH" && item.postalCode > 4) {
              if (
                item?.districtList === undefined &&
                item?.subdistList === undefined &&
                item?.cityList === undefined
              ) {
                const responseData = await postAxiosCall("data/zipcode", {
                  zipcode: item.postalCode,
                });
                if (responseData.status === 200) {
                  if (responseData?.data?.data?.city?.length === 1) {
                    let cloneMock = [...authDirectorData];
                    cloneMock[index] = {
                      ...cloneMock[index],
                      city: responseData?.data?.data?.city[0],
                      postalCode: item.postalCode,
                      districtList: responseData.data.data.districts,
                      subdistList: responseData.data.data.subdistricts,
                      cityList:
                        responseData?.data?.data?.city?.length === 1
                          ? []
                          : responseData?.data?.data?.city,
                    };
                    setAuthDirectorData(cloneMock);
                  } else {
                    let cloneMock = [...authDirectorData];
                    cloneMock[index] = {
                      ...cloneMock[index],
                      postalCode: item.postalCode,
                      districtList: responseData.data.data.districts,
                      subdistList: responseData.data.data.subdistricts,
                      cityList:
                        responseData?.data?.data?.city?.length === 1
                          ? []
                          : responseData?.data?.data?.city,
                    };
                    setAuthDirectorData(cloneMock);
                  }
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, [authDirectorData]);

  return (
    <div>
      <div className="flex justify-around lg:mx-10 xs:my-8 lg:my-8 ">
        <div className="w-4/12 lg:pl-42">
          <p className="mb-4 subpixel-antialiased font-semibold text-green lg:text-3xl">
            5. Authorize Director
          </p>
        </div>
        <div className="w-2/5">
          {action !== "addinfo" ? null : (
            <Button
              sx={{
                marginBottom: "1rem",
                float: "right",
              }}
              variant="outlined"
              size="medium"
              onClick={addMoreAuthorizeDirector}
            >
              <AddIcon /> Add More
            </Button>
          )}
          <div style={{ marginBottom: 30 }} />
          {/* ถ้า Dat มาเป็น Array */}
          {authDirectorData?.length > 0 &&
            authDirectorData?.map((item, index) => {
              let countryId = "";
              if (item?.countryId === null || item?.countryId === undefined) {
                const resCountry = countryList?.filter(
                  (x) => x.Country === item?.countryCode
                );
                countryId = resCountry[0]?._id;
              }
              return (
                <div key={index} className="container-authorize-director-2">
                  <div className="container-authorize-director-1">
                    <p className="mb-4 text-xl">Please fill the information.</p>
                    {authDirectorData.length > 1 &&
                      (action !== "addinfo" ? null : (
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          sx={{ margin: "0 0 1rem 1rem" }}
                          onClick={() => handleDelete(index)}
                          disabled={action !== "addinfo" ? true : false}
                        >
                          <DeleteIcon />
                        </Button>
                      ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
                    <TextField
                      className="p-8"
                      required
                      size="small"
                      placeholder="First Name"
                      id="firstName"
                      name="firstName"
                      value={item?.firstName}
                      label="First Name"
                      onChange={(e) => handleChange(e, index)}
                      error={isSubmit && !item?.firstName ? true : false}
                      autoComplete="off"
                      inputProps={{ maxLength: 40 }}
                      disabled={action !== "addinfo" ? true : false}
                    />
                    <TextField
                      className="p-8"
                      required
                      size="small"
                      placeholder="Last Name"
                      id="lastName"
                      name="lastName"
                      label="Last Name"
                      value={item?.lastName}
                      onChange={(e) => handleChange(e, index)}
                      error={isSubmit && !item?.lastName ? true : false}
                      autoComplete="off"
                      inputProps={{ maxLength: 40 }}
                      disabled={action !== "addinfo" ? true : false}
                    />
                  </div>
                  <FormControl className="w-full">
                    <InputLabel
                      required={true}
                      size="small"
                      id="country-select-label"
                    >
                      Select Country
                    </InputLabel>
                    <Select
                      required={true}
                      id="country-select"
                      size="small"
                      label="Select Country"
                      name="country"
                      value={
                        item?.countryId === null ||
                        item?.countryId === undefined
                          ? countryId
                          : item?.countryId
                      }
                      onChange={(e) => handleChange(e, index)}
                      defaultValue=""
                      error={isSubmit && !item?.country ? true : false}
                      disabled={action !== "addinfo" ? true : false}
                    >
                      {countryList?.map((countryData) => {
                        return (
                          <MenuItem
                            key={countryData._id}
                            value={countryData._id}
                          >
                            {countryData.Description}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
                    {item?.countryCode === "TH" ? (
                      <TextField
                        className="p-8"
                        required
                        size="small"
                        placeholder="Postal Code or Zip Code"
                        name="postalCode"
                        label="Postal Code"
                        onChange={(e) => handlePostalCode(e, index, item)}
                        value={item?.postalCode}
                        error={isSubmit && !item?.postalCode ? true : false}
                        autoComplete="off"
                        inputProps={{ maxLength: 10 }}
                        disabled={action !== "addinfo" ? true : false}
                      />
                    ) : (
                      <TextField
                        className="p-8"
                        required
                        size="small"
                        placeholder="Postal Code or Zip Code"
                        name="postalCode"
                        label="Postal Code"
                        onChange={(e) => handleNumber(e, index, item)}
                        value={item?.postalCode}
                        error={isSubmit && !item?.postalCode ? true : false}
                        autoComplete="off"
                        inputProps={{ maxLength: 10 }}
                        disabled={action !== "addinfo" ? true : false}
                      />
                    )}
                    {item?.countryCode === "VN" ? (
                      <CustomAutocomplete
                        options={
                          vietNamCityLocal.length > 0
                            ? vietNamCityLocal?.map((item) => item?.City)
                            : []
                        }
                        label="Select City"
                        name={"city"}
                        value={item?.city}
                        onChange={(e) => handleChange(e, index, item)}
                        placeholder="Search or Select"
                        getOptionLabel={(option) => option}
                        isMulti={false}
                        size={"small"}
                        disabled={action !== "addinfo" ? true : false}
                        required={true}
                        error={isSubmit && !item?.city ? true : false}
                      />
                    ) : item?.cityList?.length > 0 ? (
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
                          value={item?.city}
                          defaultValue=""
                          onChange={(e) => handleChange(e, index)}
                          required={true}
                          disabled={action !== "addinfo" ? true : false}
                        >
                          {item?.cityList?.map((cityData, city_index) => {
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
                        value={item?.city}
                        disabled={
                          item?.countryCode === "TH" || action !== "addinfo"
                            ? true
                            : false
                        }
                        sx={{
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: `${
                              action === "addinfo" && "#000000"
                            }`,
                          },
                        }}
                        onChange={(e) => handleChange(e, index, item)}
                        error={isSubmit && !item?.city ? true : false}
                        autoComplete="off"
                        inputProps={{ maxLength: 40 }}
                        // disabled={action !== "addinfo" ? true : false}
                      />
                    )}
                    {item?.countryCode === "TH" ? (
                      <>
                        <FormControl className="w-full">
                          <InputLabel size="small" id="district-select-label">
                            Select District
                          </InputLabel>
                          <Select
                            id="district-select"
                            size="small"
                            label="Select District "
                            name="salesDistrict"
                            // defaultValue=""
                            value={
                              item?.salesDistrict ? item?.salesDistrict : ""
                            }
                            onChange={(e) => handleChange(e, index)}
                            disabled={action !== "addinfo" ? true : false}
                          >
                            {item?.districtList?.map((district) => {
                              return (
                                <MenuItem key={district} value={district}>
                                  {district}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                        <FormControl className="w-full">
                          <InputLabel
                            size="small"
                            id="subdistrict-select-label"
                          >
                            Select Sub District
                          </InputLabel>
                          <Select
                            id="subdistrict-select"
                            size="small"
                            label="Select Sub District"
                            name="salesSubDistrict"
                            onChange={(e) => handleChange(e, index, item)}
                            // defaultValue=""
                            value={
                              item?.salesSubDistrict
                                ? item?.salesSubDistrict
                                : ""
                            }
                            disabled={action !== "addinfo" ? true : false}
                          >
                            {item?.subdistList?.[item?.salesDistrict]?.length >
                              0 &&
                              item?.subdistList?.[item?.salesDistrict]?.map(
                                (subDistrict) => {
                                  return (
                                    <MenuItem
                                      key={subDistrict}
                                      value={subDistrict}
                                    >
                                      {subDistrict}
                                    </MenuItem>
                                  );
                                }
                              )}
                          </Select>
                        </FormControl>
                      </>
                    ) : (
                      <>
                        {item?.countryCode === "VN" ? (
                          <CustomAutocomplete
                            options={
                              vietnamDistLocal.length > 0
                                ? vietnamDistLocal?.map(
                                    (item) => item?.District
                                  )
                                : []
                            }
                            label="Select District "
                            name="salesDistrict"
                            value={item?.salesDistrict}
                            onChange={(e) => handleChange(e, index, item)}
                            placeholder="Search or Select"
                            getOptionLabel={(option) => option}
                            isMulti={false}
                            size={"small"}
                            disabled={action !== "addinfo" ? true : false}
                          />
                        ) : (
                          <TextField
                            id="district-select"
                            size="small"
                            label="Select District "
                            name="salesDistrict"
                            value={item?.salesDistrict}
                            onChange={(e) => handleChange(e, index)}
                            autoComplete="off"
                            inputProps={{ maxLength: 40 }}
                            disabled={action !== "addinfo" ? true : false}
                          />
                        )}

                        <TextField
                          id="subdistrict-select"
                          size="small"
                          label="Select Sub District"
                          name="salesSubDistrict"
                          onChange={(e) => handleChange(e, index, item)}
                          value={item?.salesSubDistrict}
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
                      placeholder="Please fill in company's address"
                      id="houseNO"
                      name="houseNo"
                      value={item?.houseNo}
                      label="Address/House No"
                      onChange={(e) => handleChange(e, index)}
                      error={isSubmit && !item?.houseNo ? true : false}
                      autoComplete="off"
                      inputProps={{ maxLength: 40 }}
                      disabled={action !== "addinfo" ? true : false}
                    />
                    <TextField
                      className="p-8"
                      // required
                      size="small"
                      placeholder="Company Street"
                      id="companyStreet"
                      name="companyStreet"
                      label="Company Street Name"
                      value={item?.companyStreet}
                      onChange={(e) => handleChange(e, index)}
                      // error={isSubmit && !authDirectorData.street ? true : false}
                      autoComplete="off"
                      inputProps={{ maxLength: 40 }}
                      disabled={action !== "addinfo" ? true : false}
                    />
                  </div>
                  <FormControl className="w-full" sx={{ marginTop: "0" }}>
                    <InputLabel
                      required={true}
                      size="small"
                      id="region-select-label"
                    >
                      Select Region
                    </InputLabel>
                    <Select
                      id="region-select"
                      size="small"
                      className="w-full"
                      name="region"
                      label="Select Region"
                      onChange={(e) => handleChange(e, index)}
                      // defaultValue=""
                      value={item?.region ? item?.region : ""}
                      required={true}
                      error={isSubmit && !item?.region ? true : false}
                      disabled={action !== "addinfo" ? true : false}
                    >
                      {regionList?.map((region) => {
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
                      zoneCodeValue={item?.transportZoneCode}
                      getTransportData={(e) => getTransportInfo(e, index)}
                      needZoneCode={true}
                      isEditable={true}
                      disabled={action !== "addinfo" ? true : false}
                      error={isSubmit && !item?.transportZone ? true : false}
                    />
                  </div>

                  <FormControl component="fieldset">
                    <FormLabel
                      className="mt-4"
                      id="gender"
                      style={{ color: "black" }}
                    >
                      Gender
                    </FormLabel>
                    <RadioGroup
                      aria-label="gender"
                      name="gender"
                      row
                      aria-labelledby="gender"
                      className="mb-4"
                      value={item?.gender}
                      onChange={(e) => handleChange(e, index)}
                    >
                      {genderList?.map((gender) => {
                        return (
                          <FormControlLabel
                            key={gender._id}
                            value={gender.Gender}
                            control={<Radio color="success" />}
                            label={gender.Description}
                            disabled={action !== "addinfo" ? true : false}
                          />
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <TextField
                      className="p-8"
                      size="small"
                      placeholder="Tax Id"
                      name="taxId"
                      label="Tax Id"
                      value={item?.taxId}
                      onChange={(e) => handleNumber(e, index, item)}
                      //   error={isSubmit && !userDataCollection.city ? true : false}
                      autoComplete="off"
                      inputProps={{ maxLength: 13 }}
                      disabled={action !== "addinfo" ? true : false}
                    />
                    <MyDatePicker
                      label={"Date Of Birth"}
                      onChange={(e) => handleDateChange(e, index)}
                      // value={dayjs(authDirectorData.dateOfBirth)}
                      value={
                        item?.dateOfBirth?.includes(".")
                          ? formatBirth(item?.dateOfBirth)
                          : dayjs(item?.dateOfBirth)
                      }
                      disableFuture
                      disabled={action !== "addinfo" ? true : false}
                      // error={false}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
