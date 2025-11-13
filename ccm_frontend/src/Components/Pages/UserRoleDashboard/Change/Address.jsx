import React, { memo, useEffect } from "react";
import { fetchDataList } from "../../../../Store/createUserStore";
import { useState } from "react";
import InputText from "../../../CommonComponent/InputText";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import TOATransportZoneDropdown from "../../../CommonComponent/TOATransportZoneDropdown";
import CustomAutocomplete from "../../../CommonComponent/CustomAutocomplete";
import { getObjectByValue } from "../../../../Utility/Constant";
import { postAxiosCall } from "../../../../Utility/HelperFunction";
import { useParams } from "react-router-dom";

function Address({
  isSubmit,
  setAddress,
  version,
  setIntnlAddress,
  updateAddress,
  getJobData,
}) {
  const role = localStorage.getItem("role");
  const { action } = useParams();
  const isCountryLoaded = fetchDataList((state) => state.isCountryLoaded);
  const isTransPortDataLoaded = fetchDataList(
    (state) => state.isTransPortDataLoaded
  );
  const countryList = fetchDataList((state) => state.countryList);
  const regionList = fetchDataList((state) => state.dataRegion);
  const [citylist, setCityList] = useState([]);

  const [userDataCollection, setUserDataCollection] = useState({
    countryCode: "",
    country: "",
    district: "",
    subDistrict: "",
    postalCode: "",
    city: "",
    addressLine1: "",
    street: "",
    region: "",
    transportZone: "",
    transportZoneCode: "",
  });

  const [districtList, setDistrictList] = useState([]);
  const [subDistrictList, setSubDistrictList] = useState([]);
  const [countryId, setCountryId] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const data = {
      ...userDataCollection,
      [name]: value,
    };
    setUserDataCollection(data);
  };

  const handlePostalCode = (e) => {
    const { name, value } = e.target;
    const regex = /^[0-9\b]+$/;
    if (value === "" || regex.test(value)) {
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
    }
  };

  const getTransportInfo = (transportData) => {
    setUserDataCollection({
      ...userDataCollection,
      transportZone: transportData?.Description,
      transportZoneCode: transportData?.TransportationZone,
    });
  };

  const handleCountryCodeChange = (event) => {
    const { value } = event.target;
    setCountryId(value);
    const countryValue =
      countryList && getObjectByValue(countryList, "_id", value);
    setUserDataCollection({
      ...userDataCollection,
      country: countryValue.Description,
      countryCode: countryValue.Country,
      postalCode: "",
      city: "",
    });
  };

  const [subdist, setSubDist] = useState({});

  const getPostalCodeData = async (code) => {
    if (userDataCollection.countryCode === "TH" && code.length > 4) {
      const responseData = await postAxiosCall("data/zipcode", {
        zipcode: code,
      });
      if (responseData.status === 200) {
        setDistrictList(responseData.data.data.districts);
        setSubDist(responseData.data.data.subdistricts);

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
  };

  useEffect(() => {
    userDataCollection.district &&
      setSubDistrictList(subdist[userDataCollection.district]);
  }, [userDataCollection.district, subdist]);

  useEffect(() => {
    const getData = setTimeout(() => {
      getPostalCodeData(userDataCollection.postalCode);
    }, 600);

    return () => clearTimeout(getData);
  }, [userDataCollection.postalCode]);

  useEffect(() => {
    if (version === "local") {
      setAddress(userDataCollection);
    } else {
      setIntnlAddress(userDataCollection);
    }
  }, [userDataCollection]);

  // edit or view flow getJobData

  const updateCountryName = (getJobDataParams) => {
    if (action !== "add") {
      let getCountryId = getObjectByValue(
        countryList,
        "Country",
        getJobDataParams?.countryCode
      );
      setCountryId(getCountryId?._id);
    }
  };

  useEffect(() => {
    if (action && action !== "add") {
      // console.log("callinggggg");
      Object.entries(updateAddress).length > 0 &&
        setUserDataCollection({ ...userDataCollection, ...updateAddress });
    }
  }, [updateAddress]);

  useEffect(() => {
    isCountryLoaded && updateCountryName(updateAddress);
  }, [updateAddress, isCountryLoaded]);

  // console.log({ userDataCollection, updateAddress });

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

  useEffect(() => {
    getDataMasterRegionTransportZone();
  }, [
    userDataCollection.postalCode,
    userDataCollection.city,
    userDataCollection.district,
    userDataCollection.subDistrict,
  ]);

  return (
    <>
      <FormControl className="w-full">
        <InputLabel
          error={isSubmit && !userDataCollection.country ? true : false}
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
          value={countryId}
          onChange={(e) => handleCountryCodeChange(e)}
          defaultValue=""
          error={isSubmit && !userDataCollection.country ? true : false}
          disabled={
            role === "AR Master"
              ? getJobData?.isArMasterApproved
              : action === "view" || action === "status"
              ? true
              : false
          }
        >
          {isCountryLoaded ? (
            countryList.map((countryData) => {
              return (
                <MenuItem key={countryData._id} value={countryData._id}>
                  {countryData.Description}
                </MenuItem>
              );
            })
          ) : (
            <MenuItem>Loading...</MenuItem>
          )}
        </Select>
      </FormControl>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <InputText
          className="p-8"
          required
          name="postalCode"
          label="Postal Code"
          value={userDataCollection.postalCode}
          onChange={(e) => handlePostalCode(e)}
          error={isSubmit && !userDataCollection.postalCode ? true : false}
          wordLength={10}
          disabled={
            role === "AR Master"
              ? getJobData?.isArMasterApproved
              : action === "view" || action === "status"
              ? true
              : false
          }
        />
        {citylist?.length > 0 ? (
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
              disabled={
                role === "AR Master"
                  ? getJobData?.isArMasterApproved
                  : action === "view" || action === "status"
                  ? true
                  : false
              }
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
          <InputText
            className="p-8"
            required
            name="city"
            label="City"
            value={userDataCollection.city}
            onChange={(e) => handleChange(e)}
            error={isSubmit && !userDataCollection.city ? true : false}
            wordLength={40}
            disabled={
              role === "AR Master"
                ? getJobData?.isArMasterApproved
                : userDataCollection.countryCode === "TH" ||
                  action === "view" ||
                  action === "status"
                ? true
                : false
            }
          />
        )}
        <CustomAutocomplete
          options={districtList}
          label="District"
          value={userDataCollection.district}
          onChange={(e) => handleChange(e)}
          placeholder="Search or Select"
          getOptionLabel={(district) => district}
          isMulti={false}
          size={"small"}
          name={"district"}
          disabled={
            role === "AR Master"
              ? getJobData?.isArMasterApproved
              : action === "view" || action === "status"
              ? true
              : false
          }
        />

        <CustomAutocomplete
          options={subDistrictList}
          label="Sub District"
          value={userDataCollection.subDistrict}
          onChange={(e) => handleChange(e)}
          placeholder="Search or Select"
          getOptionLabel={(subdistrict) => subdistrict}
          isMulti={false}
          size={"small"}
          name={"subDistrict"}
          disabled={
            role === "AR Master"
              ? getJobData?.isArMasterApproved
              : action === "view" || action === "status"
              ? true
              : false
          }
        />

        <InputText
          className="p-8"
          required
          size="small"
          name="addressLine1"
          value={userDataCollection.addressLine1}
          label="Address/House No"
          onChange={(e) => handleChange(e)}
          error={isSubmit && !userDataCollection.addressLine1 ? true : false}
          wordLength={40}
          disabled={
            role === "AR Master"
              ? getJobData?.isArMasterApproved
              : action === "view" || action === "status"
              ? true
              : false
          }
        />
        <InputText
          className="p-8"
          size="small"
          name="street"
          label="Street Name"
          value={userDataCollection.street}
          onChange={(e) => handleChange(e)}
          wordLength={40}
          disabled={
            role === "AR Master"
              ? getJobData?.isArMasterApproved
              : action === "view" || action === "status"
              ? true
              : false
          }
        />
      </div>
      <FormControl className="w-full" sx={{ marginTop: "1rem" }}>
        <InputLabel
          error={isSubmit && !userDataCollection.region ? true : false}
          required={true}
          size="small"
          id="region-select-label"
        >
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
          sx={{
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "#777777",
              cursor: "not-allowed",
            },
            marginBottom: "1rem",
          }}
          disabled={
            role === "AR Master"
              ? getJobData?.isArMasterApproved
              : action === "view" || action === "status"
              ? true
              : false
          }
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
          needZoneCode={true}
          isEditable={true}
          error={
            isSubmit && !userDataCollection.transportZoneCode ? true : false
          }
          disabled={
            role === "AR Master"
              ? getJobData?.isArMasterApproved
              : action === "view" || action === "status"
              ? true
              : false
          }
        />
      )}
    </>
  );
}

export default memo(Address);
