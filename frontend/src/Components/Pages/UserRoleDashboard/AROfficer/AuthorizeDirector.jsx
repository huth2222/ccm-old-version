import { Female } from "@mui/icons-material";
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
import { postAxiosCall } from "../../../../Utility/HelperFunction";
import TextInputDisabled from "../../../CommonComponent/TextInputDisabled";
import TOADropdown from "../../../CommonComponent/TOADropdown";
import TOATransportZoneDropdown from "../../../CommonComponent/TOATransportZoneDropdown";
import { useParams } from "react-router-dom";

export default function AuthorizeDirector({ jobDataFromStore }) {
  const isSubmit = useUserDataStore((state) => state.isSubmited);
  // const [isSubmit, setIsSubmit] = useState(clickedSubmit);
  let { jobId, action } = useParams();
  const isCountryLoaded = fetchDataList((state) => state.isCountryLoaded);
  const countryList = fetchDataList((state) => state.countryList);
  const transPortList = fetchDataList((state) => state.transportZoneList);
  const regionList = fetchDataList((state) => state.dataRegion);
  const genderList = fetchDataList((state) => state.dataGender);
  const updateAuthorizeStore = useAuthorizeStore(
    (state) => state.updateAuthorizeDataState
  );
  const extractedData = jobDataFromStore?.authorizeDirector;
  const [vietNamCityLocal, setVietNamCityLocal] = useState([]);
  const [vietnamDistLocal, setVietnamDistLocal] = useState([]);

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
    },
  ]);

  const getTransportInfo = (transportData, index) => {
    let cloneData = [...authDirectorData];
    cloneData[index] = {
      ...cloneData[index],
      transportZone: transportData?.Description,
      transportZoneCode: transportData?.TransportationZone,
    };
    setAuthDirectorData(cloneData);
  };

  useEffect(() => {
    setAuthDirectorData(extractedData);
  }, [extractedData]);

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
                      onChange={(e) => null}
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
                      onChange={(e) => null}
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
                      onChange={(e) => null}
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
                        onChange={(e) => null}
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
                        onChange={(e) => null}
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
                        onChange={(e) => null}
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
                          onChange={(e) => null}
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
                        onChange={(e) => null}
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
                            onChange={(e) => null}
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
                            onChange={(e) => null}
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
                            onChange={(e) => null}
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
                            onChange={(e) => null}
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
                          onChange={(e) => null}
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
                      onChange={(e) => null}
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
                      onChange={(e) => null}
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
                      onChange={(e) => null}
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
                      onChange={(e) => null}
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
                      onChange={(e) => null}
                      //   error={isSubmit && !userDataCollection.city ? true : false}
                      autoComplete="off"
                      inputProps={{ maxLength: 13 }}
                      disabled={action !== "addinfo" ? true : false}
                    />
                    <MyDatePicker
                      label={"Date Of Birth"}
                      onChange={(e) => null}
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
