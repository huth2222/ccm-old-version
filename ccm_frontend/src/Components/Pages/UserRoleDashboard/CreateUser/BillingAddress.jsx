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
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import {
  fetchDataList,
  useBillingStore,
  useUserDataStore,
} from "../../../../Store/createUserStore";
import { getObjectByValue } from "../../../../Utility/Constant";
import { userDashboardStore } from "../../../../Store/jobDashboard";
import { useParams } from "react-router-dom";
import TOATransportZoneDropdown from "../../../CommonComponent/TOATransportZoneDropdown";
import CountryWithPostalCode from "../../../CommonComponent/CountryWithPostalCode";
import { postAxiosCall } from "../../../../Utility/HelperFunction";

export function BillingAddress() {
  const transPortList = fetchDataList((state) => state.transportZoneList);
  const updateBillingDataStore = useBillingStore(
    (state) => state.updateBillingAddressDataState
  );
  const isSubmit = useUserDataStore((state) => state.isSubmited);
  const regionList = fetchDataList((state) => state.dataRegion);
  const isCountryLoaded = fetchDataList((state) => state.isCountryLoaded);

  const [nameList, setNameList] = useState([{ name: "", isValid: false }]);
  const addMoreName = () => {
    let data = [[...nameList, { name: "", isValid: false }]];
    setNameList([...nameList, { name: "", isValid: false }]);
    updateBillingDataStore({ name: data.map((obj) => obj["name"]) });
  };
  const [transportId, setTransportId] = useState("");
  let { jobId, action } = useParams();

  const updateJobLoadingStoreFalse = userDashboardStore(
    (state) => state.setJobLoadedStateFalse
  );

  const isJobDataLoadedFromAPI = userDashboardStore(
    (state) => state.isJobLoaded
  );
  const isTransPortDataLoaded = fetchDataList(
    (state) => state.isTransPortDataLoaded
  );

  const getJobData = userDashboardStore((state) => state.job);

  const handleMultipleName = (e, key) => {
    const { name, value } = e.target;
    if (value.length < 36) {
      let data = [...nameList];
      // data[key][name] = value.trimStart();
      data[key] = {
        [name]: value,
        isValid: value?.trim()?.length > 0 ? true : false,
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

  const getTransportInfo = (transportData) => {
    const copiedData = {
      ...billingData,
      transportZone: transportData?.Description,
      transportZoneCode: transportData?.TransportationZone,
    };
    setBillingData(copiedData);
    updateBillingDataStore(copiedData);
  };

  const getCountriesInfo = (countries) => {
    const dataSet = {
      ...billingData,
      country: countries?.countryObj?.Description,
      countryCode: countries?.countryObj?.Country,
      district: countries?.district,
      subDistrict: countries?.subDistrict,
      city: countries?.city,
      postalCode: countries?.postalCode,
      transportZone: countries?.transportZone,
      transportZoneCode: countries?.transportZoneCode,
    };
    setBillingData(dataSet);
    updateBillingDataStore(dataSet);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "transport") {
      setTransportId(value);
      const transportValue = getObjectByValue(transPortList, "_id", value);
      // const transportValue = JSON.parse(value);
      const dataValue = {
        ...billingData,
        transportZone: transportValue.Description,
        transportZoneCode: transportValue.TransportationZone,
      };
      setBillingData(dataValue);
      updateBillingDataStore(dataValue);
    } else {
      const copiedData = {
        ...billingData,
        [name]: value,
      };
      setBillingData(copiedData);
      updateBillingDataStore(copiedData);
    }
  };

  const updateLocalStateForEdit = (salesParamsJobData) => {
    const extractedData = salesParamsJobData?.billingAddress
      ? salesParamsJobData.billingAddress
      : billingData;
    setBillingData({
      ...billingData,
      ...extractedData,
    });
    const extractedNames = extractedData?.name ? extractedData?.name : [];
    let setNameObjectFormat =
      extractedNames.length > 0
        ? extractedNames.map((item) => {
            return { name: item, isValid: true };
          })
        : nameList;
    setNameList(setNameObjectFormat);
  };

  const isUserCameForEdit = location.pathname.includes("edituser");

  const updateTransportZone = (getJobDataParams) => {
    if (isUserCameForEdit) {
      let getTransportId = getObjectByValue(
        transPortList,
        "TransportationZone",
        getJobDataParams?.billingAddress?.transportZoneCode
      );
      setTransportId(getTransportId?._id);
    }
  };

  const isAvailableBillingData = getJobData?.billingAddress ? true : false;

  useEffect(() => {
    if (isAvailableBillingData) {
      isJobDataLoadedFromAPI && updateLocalStateForEdit(getJobData);
      isTransPortDataLoaded && updateTransportZone(getJobData);
      updateJobLoadingStoreFalse();
    }
  }, [isJobDataLoadedFromAPI, isTransPortDataLoaded]);

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

  return (
    <div>
      <div className="flex justify-around lg:mx-10 xs:my-8 lg:my-8 ">
        <div className="w-4/12 lg:pl-42">
          <p className="mb-4 subpixel-antialiased font-semibold text-green lg:text-3xl">
            6. Billing Address
          </p>
        </div>
        <div className="w-2/5">
          <p className="mb-4 text-xl">Please fill the information.</p>
          <FormControl component="fieldset">
            <FormLabel
              className="mt-4"
              id="addressType"
              style={{ color: "red" }}
            >
              Please Select
            </FormLabel>
            <RadioGroup
              aria-label="addressType"
              name="billingAddressChoose"
              row
              aria-labelledby="addressType"
              className="mb-4"
              value={billingData.billingAddressChoose}
              onChange={handleChange}
            >
              <FormControlLabel
                value="sameAddress"
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
          {billingData.billingAddressChoose !== "sameAddress" && (
            <div>
              <div className="mt-4">
                {nameList.map((item, index) => {
                  return (
                    <div key={index} className="flex full">
                      <TextField
                        className="w-full p-8"
                        sx={{ marginBottom: "1rem" }}
                        required
                        size="small"
                        placeholder="Please fill company's name (max 35 digits)."
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
                          onClick={() => handleDelete(index)}
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
                    onClick={addMoreName}
                  >
                    <AddIcon /> Add More
                  </Button>
                )}
              </div>
              <TextField
                className="w-full p-8"
                required
                size="small"
                placeholder="Enter Your House No."
                id="houseNO"
                name="addressLine1"
                label="Address/House No"
                value={billingData.addressLine1}
                onChange={(e) => handleChange(e)}
                error={isSubmit && !billingData.addressLine1 ? true : false}
                autoComplete="off"
                inputProps={{ maxLength: 40 }}
                disabled={action !== "addinfo" ? true : false}
              />

              <TextField
                className="w-full p-8"
                // required
                size="small"
                placeholder="Street"
                id="street"
                name="street"
                label="Street Name"
                value={billingData.street}
                onChange={(e) => handleChange(e)}
                autoComplete="off"
                sx={{ marginTop: "1rem", marginBottom: "1rem" }}
                inputProps={{ maxLength: 40 }}
                disabled={action !== "addinfo" ? true : false}
              />
              {isCountryLoaded && (
                <CountryWithPostalCode
                  getCountriesData={getCountriesInfo}
                  countryCode={billingData?.countryCode}
                  postalValue={billingData?.postalCode}
                  cityValue={billingData?.city}
                  districtValue={billingData?.district}
                  subDistrictValue={billingData?.subDistrict}
                  isEditable={true}
                  isSubmit={isSubmit}
                />
              )}

              <FormControl className="w-full">
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
                  onChange={handleChange}
                  // defaultValue=""
                  value={billingData.region}
                  required={true}
                  error={isSubmit && !billingData.region ? true : false}
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
                  zoneCodeValue={billingData.transportZoneCode}
                  getTransportData={getTransportInfo}
                  needZoneCode={true}
                  isEditable={true}
                  disabled={action !== "addinfo" ? true : false}
                  error={isSubmit && !billingData.transportZone ? true : false}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
