import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { memo, useEffect, useState } from "react";
import {
  fetchDataList,
  useBillingStore,
} from "../../../../Store/createUserStore";
import { getObjectByValue } from "../../../../Utility/Constant";
import InputText from "../../../CommonComponent/InputText";
import { useParams } from "react-router-dom";
import TOATransportZoneDropdown from "../../../CommonComponent/TOATransportZoneDropdown";
import { postAxiosCall } from "../../../../Utility/HelperFunction";
import CustomAutocomplete from "../../../CommonComponent/CustomAutocomplete";

function BillingAddressInfo({
  isSubmit,
  setBillingAddressData,
  updateBillingAddress,
  getJobData,
}) {
  const role = localStorage.getItem("role");
  const { action } = useParams();
  const transPortList = fetchDataList((state) => state.transportZoneList);
  const updateBillingDataStore = useBillingStore(
    (state) => state.updateBillingAddressDataState
  );
  const regionList = fetchDataList((state) => state.dataRegion);

  const [nameList, setNameList] = useState([{ name: "", isValid: false }]);
  const addMoreName = () => {
    setNameList([...nameList, { name: "", isValid: false }]);
  };
  const [transportId, setTransportId] = useState("");
  const isTransPortDataLoaded = fetchDataList(
    (state) => state.isTransPortDataLoaded
  );
  const [countryCodes, setCountryCodes] = useState("");
  const [countryChangedId, setCountryChangedId] = useState(null);
  const [city, setCity] = useState("");
  const [districtList, setDistrictList] = useState([]);
  const [subDistForTH, setSubDistForTH] = useState([]);
  const [subDistrictList, setSubDistrictList] = useState([]);
  const [vietNamCityLocal, setVietNamCityLocal] = useState([]);
  const [postalCode, setPostalCode] = useState("");
  const [province, setProvince] = useState({
    district: "",
    subDistrict: "",
  });
  const countryList = fetchDataList((state) => state.countryList);
  const [selectedCountryObj, setSelectedCountryObj] = useState("");
  const [addressLocalState, setAddressLocalState] = useState({
    city: "",
    district: "",
    subDistrict: "",
    postalCode: "",
    countryObj: {},
  });
  const [citylist, setCityList] = useState([]);
  const isCountryLoaded = fetchDataList((state) => state.isCountryLoaded);

  const handleMultipleName = (e, key) => {
    const { name, value } = e.target;
    if (value.length < 36) {
      let data = [...nameList];
      data[key] = {
        [name]: value.trimStart(),
        isValid: value.length > 0 ? true : false,
      };
      setNameList(data);
      updateBillingDataStore({ name: data.map((obj) => obj["name"]) });
    }
  };

  const handleDelete = (key) => {
    let data = [...nameList];
    data.splice(key, 1);
    setNameList(data);
    updateBillingDataStore({ name: data.map((obj) => obj["name"]) });
  };

  const [billingData, setBillingData] = useState({
    billingAddressChoose: "sameAddress",
    countryCode: "",
    country: "",
    postalCode: "",
    city: "",
    district: "",
    subDistrict: "",
    addressLine1: "",
    street: "",
    region: "",
    transportZoneCode: "",
    transportZone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const copiedData = {
      ...billingData,
      [name]: value,
    };
    setBillingData(copiedData);
    updateBillingDataStore(copiedData);
  };

  const handleCIty = (e) => {
    const { name, value } = e.target;
    setCity(value);
    setBillingData({ ...billingData, city: value });
    updateBillingDataStore({ ...billingData, city: value });
  };

  const getTransportInfo = (transportData) => {
    setBillingData({
      ...billingData,
      transportZone: transportData?.Description,
      transportZoneCode: transportData?.TransportationZone,
    });
  };

  const handleNumber = (e) => {
    const { name, value } = e.target;
    const regex = /^[0-9\b]+$/;
    if (value === "" || regex.test(value)) {
      const copiedData = {
        ...billingData,
        [name]: value,
      };
      setPostalCode(value);
      setBillingData(copiedData);
      updateBillingDataStore(copiedData);
    }
  };

  const handleProviceChange = (e) => {
    const { name, value } = e.target;
    const data = {
      ...province,
      [name]: value,
    };
    setProvince(data);
    setBillingData({ ...billingData, ...data });
    updateBillingDataStore({ ...billingData, ...data });
  };

  const getCountriesData = (countries) => {
    const dataSet = {
      ...billingData,
      country: countries?.countryObj?.Description,
      countryCode: countries?.countryObj?.Country,
      district: countries?.district,
      subDistrict: countries?.subDistrict,
      city: countries?.city,
      transportZone: countries?.transportZone,
      transportZoneCode: countries?.transportZoneCode,
    };
    setBillingData(dataSet);
    updateBillingDataStore(dataSet);
  };

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

  const getPostalCodeData = async () => {
    if (selectedCountryObj?.Country === "TH") {
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

  useEffect(() => {
    setBillingAddressData({
      ...billingData,
      name: nameList.map((obj) => obj["name"]),
    });
  }, [billingData, nameList]);

  // edit flow

  // const updateTransportZone = (getJobDataParams) => {
  //   if (action !== "add") {
  //     let getTransportId = getObjectByValue(
  //       transPortList,
  //       "TransportationZone",
  //       getJobDataParams?.transportZoneCode
  //     );
  //     setTransportId(getTransportId?._id);
  //   }
  // };

  function removeObjKey(obj, keyToRemove) {
    const { [keyToRemove]: removedKey, ...newObj } = obj;
    return newObj;
  }

  useEffect(() => {
    if (action && action !== "add") {
      const billingObj = updateBillingAddress
        ? removeObjKey(updateBillingAddress, "name")
        : {};
      setBillingData(billingObj);

      const extractedNames = updateBillingAddress?.name
        ? updateBillingAddress?.name
        : [];
      let setNameObjectFormat =
        extractedNames.length > 0
          ? extractedNames.map((item) => {
              return { name: item, isValid: true };
            })
          : nameList;
      setNameList(setNameObjectFormat);
    }
  }, [updateBillingAddress]);

  useEffect(() => {
    postalCode?.length > 0 && getPostalCodeData();
  }, [postalCode]);

  useEffect(() => {
    if (subDistForTH !== undefined) {
      province?.district &&
        setSubDistrictList(subDistForTH[province?.district]);
    }
  }, [province?.district, subDistForTH]);

  // useEffect(() => {
  //   isTransPortDataLoaded && updateTransportZone(updateBillingAddress);
  // }, [updateBillingAddress, isTransPortDataLoaded]);

  const getDataMasterRegionTransportZone = async () => {
    try {
      if (
        billingData?.postalCode?.length > 0 &&
        billingData?.city?.length > 0 &&
        billingData?.district?.length > 0 &&
        billingData?.subDistrict?.length > 0
      ) {
        const responseData = await postAxiosCall("data/regionTransportZone", {
          ZipCode: billingData?.postalCode,
          Province: billingData?.city,
          Amphure: billingData?.district,
          SubDistric: billingData?.subDistrict,
        });
        const cloneData = {
          ...billingData,
          region: responseData?.data?.Region,
          transportZoneCode: responseData?.data?.TransportZone,
          transportZone: responseData?.data?.Descripyion,
        };
        setBillingData(cloneData);
        updateBillingDataStore(cloneData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataMasterRegionTransportZone();
  }, [
    billingData?.postalCode,
    billingData?.city,
    billingData?.district,
    billingData?.subDistrict,
  ]);

  const getData = async () => {
    try {
      if (countryList?.length > 0) {
        await countryList?.map((item) => {
          if (item?.Country === billingData?.countryCode) {
            setCountryCodes(item["_id"]);
          }
        });
      }
      setPostalCode(billingData?.postalCode);
      setCity(billingData?.city);
      setProvince({
        district: billingData?.district,
        subDistrict: billingData?.subDistrict,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, [countryList]);

  return (
    <div>
      <p className="mt-4 mb-4 text-xl">Billing Address.</p>
      <div>
        {nameList?.map((item, index) => (
          <div key={index} className="flex mt-4 full">
            <InputText
              className="w-full p-8"
              required
              size="small"
              placeholder="Please fill company's name (max 35 digits)."
              id="name"
              name="name"
              value={item.name}
              label="Name"
              onChange={(e) => handleMultipleName(e, index)}
              error={isSubmit && !item.isValid ? true : false}
              wordLength={35}
              disabled={
                role === "AR Master"
                  ? getJobData?.isArMasterApproved
                  : action === "view" || action === "status"
                  ? true
                  : false
              }
            />
            {nameList.length > 1 &&
              action !== "view" &&
              action !== "status" && (
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  sx={{ margin: "0 0 1rem 1rem" }}
                  onClick={() => handleDelete(index)}
                >
                  <DeleteIcon />
                </Button>
              )}
          </div>
        ))}

        {nameList.length < 4 && action !== "view" && action !== "status" && (
          <Button
            sx={{
              marginBottom: "1rem",
              marginTop: "1rem",
              float: "right",
            }}
            variant="outlined"
            size="medium"
            onClick={addMoreName}
          >
            <AddIcon /> Add More
          </Button>
        )}
      </div>
      <InputText
        className="w-full p-8"
        required
        mt={"1rem"}
        name="addressLine1"
        label="Address/House No"
        value={billingData.addressLine1}
        onChange={(e) => handleChange(e)}
        error={isSubmit && !billingData.addressLine1 ? true : false}
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
        className="w-full p-8"
        name="street"
        label="Street Name"
        value={billingData.street}
        onChange={(e) => handleChange(e)}
        sx={{ marginTop: "1rem" }}
        wordLength={40}
        disabled={
          role === "AR Master"
            ? getJobData?.isArMasterApproved
            : action === "view" || action === "status"
            ? true
            : false
        }
      />
      <div className="mt-3">
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
              role === "AR Master"
                ? getJobData?.isArMasterApproved
                : action === "view" || action === "status"
                ? true
                : false
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
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <InputText
          className="p-8"
          required
          name="postalCode"
          label="Postal Code"
          onChange={(e) => handleNumber(e)}
          value={postalCode}
          error={isSubmit && !postalCode ? true : false}
          autoComplete="off"
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
              value={city}
              defaultValue=""
              onChange={(e) => handleCIty(e)}
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
            value={city}
            onChange={(e) => handleCIty(e)}
            error={isSubmit && !city ? true : false}
            wordLength={40}
            disabled={
              role === "AR Master"
                ? getJobData?.isArMasterApproved
                : action === "view" || action === "status"
                ? true
                : false
            }
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
          value={province.subDistrict}
          onChange={handleProviceChange}
          placeholder="Start typing to search"
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
      </div>
      <FormControl className="w-full" sx={{ marginTop: "1rem" }}>
        <InputLabel
          error={isSubmit && !billingData.region ? true : false}
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
          onChange={handleChange}
          value={billingData.region}
          required={true}
          error={isSubmit && !billingData.region ? true : false}
          sx={{
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "#777777",
              cursor: "not-allowed",
            },
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
      <div className="mt-4">
        {isTransPortDataLoaded && (
          <TOATransportZoneDropdown
            zoneCodeValue={billingData.transportZoneCode}
            getTransportData={getTransportInfo}
            needZoneCode={true}
            isEditable={true}
            disabled={
              role === "AR Master"
                ? getJobData?.isArMasterApproved
                : action === "view" || action === "status"
                ? true
                : false
            }
            error={isSubmit && !billingData.transportZone ? true : false}
          />
        )}
      </div>
    </div>
  );
}

export default memo(BillingAddressInfo);
