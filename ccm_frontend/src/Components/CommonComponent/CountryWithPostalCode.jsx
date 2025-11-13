import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { getAxiosCall, postAxiosCall } from "../../Utility/HelperFunction";
import {
  fetchDataList,
  // useAddressDataStore,
  useUserDataStore,
} from "../../Store/createUserStore";
import CustomAutocomplete from "./CustomAutocomplete";
import { getObjectByValue } from "../../Utility/Constant";
import { useParams } from "react-router-dom";

function CountryWithPostalCode({
  getCountriesData,
  countryCode,
  postalValue,
  cityValue,
  districtValue,
  subDistrictValue,
  isEditable = false,
  isSubmit = false,
}) {
  const { action } = useParams();
  // const isSubmit = useUserDataStore((state) => state.isSubmited);
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [districtList, setDistrictList] = useState([]);
  const [subDistForTH, setSubDistForTH] = useState([]);
  const [subDistrictList, setSubDistrictList] = useState([]);
  const [vietNamCityLocal, setVietNamCityLocal] = useState([]);
  const [countryChangedId, setCountryChangedId] = useState(null);
  const [countryCodes, setCountryCodes] = useState("");
  const [selectedCountryObj, setSelectedCountryObj] = useState("");
  const [province, setProvince] = useState({
    district: "",
    subDistrict: "",
  });

  const countryList = fetchDataList((state) => state.countryList);
  const path = location.pathname;

  const [addressLocalState, setAddressLocalState] = useState({
    city: "",
    district: "",
    subDistrict: "",
    postalCode: "",
    countryObj: {},
  });
  const [citylist, setCityList] = useState([]);
  const isCountryLoaded = fetchDataList((state) => state.isCountryLoaded);

  const handleCountryCodeChange = (event) => {
    const { value } = event.target;
    setCountryChangedId(value);
    setCity("");
    setDistrictList([]);
    setSubDistForTH([]);
    setSubDistrictList([]);
    setVietNamCityLocal([]);
    setPostalCode("");
    setProvince({
      district: "",
      subDistrict: "",
    });
    setCountryCodes(value);
    const countryValue =
      countryList && getObjectByValue(countryList, "_id", value);
    setSelectedCountryObj(countryValue);
    setAddressLocalState({ ...addressLocalState, countryObj: countryValue });
    getCountriesData({ ...addressLocalState, countryObj: countryValue });
  };

  const handlePostalCodeChange = (event) => {
    const { value } = event.target;
    const regex = /^[0-9\b]+$/;
    if (value === "" || regex.test(value)) {
      setPostalCode(value);
      setAddressLocalState({ ...addressLocalState, postalCode: value });
      getCountriesData({ ...addressLocalState, postalCode: value });
    }
  };

  const getPostalCodeData = async () => {
    if (selectedCountryObj?.Country === "TH" || countryCode === "TH") {
      const responseData = await postAxiosCall("data/zipcode", {
        zipcode: postalCode,
      });
      if (responseData?.status === 200) {
        setDistrictList(responseData?.data?.data?.districts);
        setSubDistForTH(responseData?.data?.data?.subdistricts);

        if (responseData?.data?.data?.city?.length === 1) {
          setCity(responseData?.data?.data?.city[0]);
          setAddressLocalState({
            ...addressLocalState,
            city: responseData?.data?.data?.city[0],
          });
          getCountriesData({
            ...addressLocalState,
            city: responseData?.data?.data?.city[0],
          });
        } else {
          setCity("");
          setAddressLocalState({
            ...addressLocalState,
            city: "",
          });
          getCountriesData({
            ...addressLocalState,
            city: "",
          });
        }
        setCityList(
          responseData?.data?.data?.city?.length === 1
            ? []
            : responseData?.data?.data?.city
        );
      } else {
        setCity("");
        setDistrictList([]);
        setSubDistrictList([]);
        setSubDistForTH([]);
      }
    } else {
      return;
    }
  };

  const handleCIty = (e) => {
    const { name, value } = e.target;
    setCity(value);
    setAddressLocalState({ ...addressLocalState, city: value });
    getCountriesData({ ...addressLocalState, city: value });
  };

  const handleProviceChange = (e) => {
    const { name, value } = e.target;
    const data = {
      ...province,
      [name]: value,
    };
    setProvince(data);
    setAddressLocalState({ ...addressLocalState, ...data });
    getCountriesData({ ...addressLocalState, ...data });
  };

  const setCountryObjectOnEdit = (countryCode) => {
    const getCountryObj = getObjectByValue(countryList, "Country", countryCode);
    setCountryCodes(getCountryObj._id);
    const copiedData = {
      ...addressLocalState,
      countryObj: getCountryObj,
      postalCode: postalValue,
      city: cityValue,
      district: districtValue,
      subDistrict: subDistrictValue,
    };
    setAddressLocalState(copiedData);
  };

  // for Edit
  useEffect(() => {
    if (isEditable) {
      countryCode && setCountryObjectOnEdit(countryCode);
      postalValue && setPostalCode(postalValue);
      cityValue && setCity(cityValue);
      setProvince({
        ...province,
        district: districtValue,
        subDistrict: subDistrictValue,
      });
    }
  }, [countryCode, isEditable]);

  useEffect(() => {
    postalCode?.length > 0 && getPostalCodeData();
  }, [postalCode]);

  const getVietnamCity = async () => {
    const sendRequest = await getAxiosCall("data/getCityVietnam");
    if (sendRequest.status === 200) {
      setVietNamCityLocal(sendRequest.data?.data?.map((item) => item.City));
    }
  };

  useEffect(() => {
    countryCode === "VN" && getVietnamCity();
  }, [countryCode, selectedCountryObj]);

  const getVietnamDistrict = async (cityName) => {
    if (countryCode === "VN") {
      const sendRequest = await getAxiosCall(
        `data/getDistrictVietnam/${cityName}`
      );
      if (sendRequest.status === 200) {
        setDistrictList(sendRequest.data?.data?.map((item) => item.District));
      }
    }
  };

  useEffect(() => {
    if (subDistForTH !== undefined) {
      province?.district &&
        setSubDistrictList(subDistForTH[province?.district]);
    }
  }, [province?.district, subDistForTH]);

  useEffect(() => {
    city && getVietnamDistrict(city);
  }, [city]);

  useEffect(() => {
    if (countryChangedId !== null) {
      setPostalCode("");
      setDistrictList([]);
      setSubDistrictList([]);
      setVietNamCityLocal([]);
      setCity("");
      setProvince({
        district: "",
        subDistrict: "",
      });
      const resetData = {
        ...addressLocalState,
        city: "",
        district: "",
        subDistrict: "",
        postalCode: "",
      };
      setAddressLocalState(resetData);
      getCountriesData(resetData);
    }
  }, [countryChangedId]);

  return (
    <>
      <FormControl className="w-full">
        <InputLabel required value="" size="small">
          Select Country
        </InputLabel>
        <Select
          required
          size="small"
          label="Select Country"
          value={countryCodes}
          onChange={handleCountryCodeChange}
          error={isSubmit && !countryCodes ? true : false}
          disabled={
            action === "addinfo" || path === "/change-request" ? false : true
          }
          sx={{
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "#777777",
              cursor: "not-allowed",
            },
          }}
        >
          {countryList.map((countryData) => (
            <MenuItem key={countryData._id} value={countryData._id}>
              {countryData.Description}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
        <TextField
          required
          size="small"
          placeholder="Postal code"
          label="Postal Code"
          value={postalCode}
          onChange={handlePostalCodeChange}
          inputProps={{ maxLength: 10 }}
          error={isSubmit && !postalCode ? true : false}
          disabled={
            action === "addinfo" || path === "/change-request" ? false : true
          }
          sx={{
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "#777777",
              cursor: "not-allowed",
            },
          }}
        />
        {/* {addressLocalState.countryObj?.Country !== "VN" || */}
        {countryCode === "VN" ||
        addressLocalState.countryObj?.Country === "VN" ? (
          <CustomAutocomplete
            options={vietNamCityLocal}
            label="Select City"
            name={"city"}
            value={city}
            onChange={(e) => handleCIty(e)}
            placeholder="Search or Select"
            getOptionLabel={(option) => option}
            isMulti={false}
            size={"small"}
            disabled={action === "addinfo" ? false : true}
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
              value={city}
              defaultValue=""
              onChange={(e) => handleCIty(e)}
              required={true}
              disabled={action === "addinfo" ? false : true}
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
            size="small"
            name="city"
            label="City"
            disabled={
              addressLocalState.countryObj?.Country === "TH"
                ? true
                : action === "addinfo"
                ? false
                : true
            }
            value={city}
            onChange={(e) => handleCIty(e)}
            inputProps={{ maxLength: 30 }}
            required
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#777777",
                cursor: "not-allowed",
              },
            }}
            error={isSubmit && !city ? true : false}
          />
        )}

        <CustomAutocomplete
          options={districtList}
          label="District"
          value={province.district}
          onChange={handleProviceChange}
          placeholder="Start typing to search"
          getOptionLabel={(district) => district}
          isMulti={false}
          size={"small"}
          name={"district"}
          disabled={action === "addinfo" ? false : true}
        />

        <CustomAutocomplete
          options={subDistrictList}
          label="Sub District"
          value={province.subDistrict}
          onChange={handleProviceChange}
          placeholder="Start typing to search"
          getOptionLabel={(subdistrict) => subdistrict}
          isMulti={false}
          size={"small"}
          name={"subDistrict"}
          disabled={action === "addinfo" ? false : true}
        />
      </div>
    </>
  );
}

export default CountryWithPostalCode;
