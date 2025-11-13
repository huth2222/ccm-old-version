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
  createUser,
  fetchDataList,
  useBillingStore,
  useUserDataStore,
} from "../../../../Store/createUserStore";
import { getObjectByValue } from "../../../../Utility/Constant";
import { userDashboardStore } from "../../../../Store/jobDashboard";
import { useParams } from "react-router-dom";
import InputText from "../../../CommonComponent/InputText";
import TOATransportZoneDropdown from "../../../CommonComponent/TOATransportZoneDropdown";
import CountryWithPostalCode from "../../../CommonComponent/CountryWithPostalCode";
import { postAxiosCall } from "../../../../Utility/HelperFunction";

export default function BillingInfo() {
  const { action } = useParams();
  const transPortList = fetchDataList((state) => state.transportZoneList);
  const updateBillingDataStore = useBillingStore(
    (state) => state.updateBillingAddressDataState
  );
  const updateBillingInfoStore = useBillingStore(
    (state) => state.updateBillingInfo
  );
  const isSubmitClicked = createUser((state) => state.isSubmitClicked);
  // const isSubmit = useUserDataStore((state) => state.isSubmited);
  const regionList = fetchDataList((state) => state.dataRegion);

  const [nameList, setNameList] = useState([{ name: "", isValid: false }]);
  const addMoreName = () => {
    setNameList([...nameList, { name: "", isValid: false }]);
  };
  const [transportId, setTransportId] = useState("");

  const updateJobLoadingStoreFalse = userDashboardStore(
    (state) => state.setJobLoadedStateFalse
  );

  const isJobDataLoadedFromAPI = userDashboardStore(
    (state) => state.isJobLoaded
  );
  // const isCountryLoaded = fetchDataList((state) => state.isCountryLoaded);
  const isTransPortDataLoaded = fetchDataList(
    (state) => state.isTransPortDataLoaded
  );

  const getJobData = userDashboardStore((state) => state.job);

  // const [lengthExceed, setLengthExceed] = useState(false);

  const handleMultipleName = (e, key) => {
    const { name, value } = e.target;
    if (value.length < 36) {
      let data = [...nameList];
      // data[key][name] = value.trimStart();
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
    biilingSearchTerm: "",
    salesDistrict: "",
    salesSubDistrict: "",
  });

  const getTransportInfo = (transportData) => {
    setBillingData({
      ...billingData,
      transportZone: transportData?.Description,
      transportZoneCode: transportData?.TransportationZone,
    });
  };

  const getCountriesInfo = (countries) => {
    const countryData = {
      ...billingData,
      country: countries?.countryObj?.Description,
      countryCode: countries?.countryObj?.Country,
      salesDistrict: countries.district,
      salesSubDistrict: countries.subDistrict,
      city: countries.city,
      postalCode: countries?.postalCode,
      transportZone: countries?.transportZone,
      transportZoneCode: countries?.transportZoneCode,
    };
    setBillingData(countryData);
    updateBillingDataStore(countryData);
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

  const handleNumber = (e) => {
    const { name, value } = e.target;
    const regex = /^[0-9\b]+$/;
    if (value === "" || regex.test(value)) {
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
    const extractedNames = extractedData.name ?? [];
    let setNameObjectFormat = extractedNames?.map((item) => {
      return { name: item, isValid: true };
    });

    setNameList(setNameObjectFormat);
  };

  const isUserCameForEdit = location.pathname.includes("addinfo");

  const updateTransportZone = (getJobDataParams) => {
    // if (isUserCameForEdit) {
    if (isTransPortDataLoaded && transPortList.length > 0) {
      let getTransportId = getObjectByValue(
        transPortList,
        "TransportationZone",
        getJobDataParams?.billingAddress?.transportZoneCode
      );
      setTransportId(getTransportId?._id);
    }
    // }
  };

  useEffect(() => {
    updateBillingInfoStore({
      ...billingData,
      name: nameList.map((obj) => obj["name"]),
    });
  }, [billingData, nameList]);

  useEffect(() => {
    if (getJobData.billingAddress.billingAddressChoose !== "sameAddress") {
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
        billingData?.salesDistrict?.length > 0 &&
        billingData?.salesSubDistrict?.length > 0
      ) {
        const responseData = await postAxiosCall("data/regionTransportZone", {
          ZipCode: billingData?.postalCode,
          Province: billingData?.city,
          Amphure: billingData?.salesDistrict,
          SubDistric: billingData?.salesSubDistrict,
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
    billingData?.salesDistrict,
    billingData?.salesSubDistrict,
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
              <InputText
                className="w-full p-8"
                name="biilingSearchTerm"
                label="Search Term"
                value={billingData.biilingSearchTerm}
                onChange={(e) => handleChange(e)}
                wordLength={40}
                disabled={action !== "addinfo" ? true : false}
              />
              <div className="mt-4">
                {nameList?.map((item, index) => {
                  return (
                    <div key={index} className="flex mt-4 mb-2 full">
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
                        error={isSubmitClicked && !item.isValid ? true : false}
                        wordLength={35}
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
              <InputText
                className="w-full p-8"
                required
                mt={"1rem"}
                name="addressLine1"
                label="Address/House No"
                value={billingData.addressLine1}
                onChange={(e) => handleChange(e)}
                error={
                  isSubmitClicked && !billingData.addressLine1 ? true : false
                }
                wordLength={40}
                disabled={action !== "addinfo" ? true : false}
              />

              <InputText
                className="w-full p-8"
                name="street"
                label="Street Name"
                value={billingData.street}
                onChange={(e) => handleChange(e)}
                sx={{ marginTop: "1rem" }}
                wordLength={40}
                disabled={action !== "addinfo" ? true : false}
              />
              <div style={{ marginTop: 15 }} />
              <CountryWithPostalCode
                getCountriesData={getCountriesInfo}
                countryCode={billingData.countryCode}
                postalValue={billingData.postalCode}
                cityValue={billingData.city}
                districtValue={billingData.district}
                subDistrictValue={billingData.subDistrict}
                isEditable={true}
                isSubmit={isSubmitClicked}
                disabled={action !== "addinfo" ? true : false}
              />
              <FormControl className="w-full" sx={{ marginTop: "1rem" }}>
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
                  error={isSubmitClicked && !billingData.region ? true : false}
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
                  zoneCodeValue={billingData.transportZoneCode}
                  getTransportData={getTransportInfo}
                  needZoneCode={true}
                  isEditable={true}
                  disabled={action !== "addinfo" ? true : false}
                  error={
                    isSubmitClicked && !billingData.transportZone ? true : false
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
