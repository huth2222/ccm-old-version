import { useNavigate, useParams } from "react-router-dom";
import { memo, useEffect, useState } from "react";
import InputText from "../../../CommonComponent/InputText";
import CountryWithPostalCode from "../../../CommonComponent/CountryWithPostalCode";
import {
  fetchDataList,
  useInternationalAddressDataStore,
} from "../../../../Store/createUserStore";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
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
import TOATransportZoneDropdown from "../../../CommonComponent/TOATransportZoneDropdown";
import { validateObjectFields } from "../../../../Utility/Constant";

function InternationalInfo({
  jobDataFromStore,
  isSubmit,
  IsInternationDataValid,
}) {
  let { action } = useParams();
  const isCountryLoaded = fetchDataList((state) => state.isCountryLoaded);
  const isTransPortDataLoaded = fetchDataList(
    (state) => state.isTransPortDataLoaded
  );
  const regionList = fetchDataList((state) => state.dataRegion);
  const transportationZoneList = fetchDataList(
    (state) => state.transportZoneList
  );

  const updateIntnlAddressStore = useInternationalAddressDataStore(
    (state) => state.updateAddressDataIntoStore
  );

  const [foreignTransportId, setForeignTransportId] = useState("");
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
    internationalSearchTerm_1: "",
    internationalSearchTerm_2: "",
    // name: [],
  });

  const [intlNameList, setIntlNameList] = useState([
    { intlName: "", intlIsvalid: false },
  ]);
  const addMoreName = () => {
    setIntlNameList([...intlNameList, { intlName: "", intlIsvalid: false }]);
  };

  const handleMultipleName = (e, key) => {
    const { name, value } = e.target;
    let data = [...intlNameList];
    data[key] = {
      [name]: value,
      intlIsvalid: value.length > 0 ? true : false,
    };
    setIntlNameList(data);
  };

  const handleDelete = (key) => {
    let data = [...intlNameList];
    data.splice(key, 1);
    setIntlNameList(data);
  };

  const getCountriesInfo = (countries) => {
    // console.log("get countries Data", countries);
    setUserInternationalData({
      ...userInternationalData,
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
    setUserInternationalData({
      ...userInternationalData,
      transportZone: transportData?.Description,
      transportZoneCode: transportData?.TransportationZone,
    });
  };

  const updateNameLIst = () => {
    const names =
      jobDataFromStore?.generalInfomation?.internationalGeneral?.name;
    let setNameObjectFormat =
      names?.length > 0
        ? names.map((item) => {
            return { intlName: item, intlIsvalid: false };
          })
        : intlNameList;
    // console.log("...name list ", setNameObjectFormat);

    setIntlNameList(setNameObjectFormat);
  };

  const handleInternationAddress = (e) => {
    const { name, value } = e.target;
    const copiedData = { ...userInternationalData, [name]: value };
    setUserInternationalData(copiedData);
  };

  const extractedData =
    jobDataFromStore?.generalInfomation?.internationalGeneral;

  // setUserDataCollection();

  // useEffect(() => {
  //   const isValid = validateObjectFields(userInternationalData, excluedFields);
  //   console.log(isValid);
  //   IsInternationDataValid(isValid);
  // }, [isSubmit]);
  // delete userInternationalData.getIntnlDataFromStore;

  useEffect(() => {
    const mergedData = {
      ...userInternationalData,
      name:
        intlNameList?.length > 0
          ? intlNameList?.map((name) => name.intlName)
          : [],
    };
    updateIntnlAddressStore(mergedData);
  }, [userInternationalData]);

  useEffect(() => {
    const copiedData = {
      ...userInternationalData,
      ...extractedData,
      internationalSearchTerm_1:
        jobDataFromStore?.generalInfomation?.internationalSearchTerm_1 ?? "",
      internationalSearchTerm_2:
        jobDataFromStore?.generalInfomation?.internationalSearchTerm_2 ?? "",
    };
    setUserInternationalData(copiedData);
    updateNameLIst(jobDataFromStore);
  }, [jobDataFromStore]);

  // console.log("eelo", userInternationalData, intlNameList);

  return (
    <div>
      <div className="mt-4">
        {intlNameList?.map((item, index) => {
          return (
            <div key={index} className="flex full">
              <InputText
                className="w-full p-8"
                required
                size="small"
                name="intlName"
                value={item.intlName}
                label="Name"
                onChange={(e) => handleMultipleName(e, index)}
                // error={isSubmit && !item.intlIsvalid ? true : false}
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
              {intlNameList.length > 1 && action === "addinfo" && (
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
        {intlNameList?.length < 4 && action === "addinfo" && (
          <Button
            sx={{
              marginBottom: "1rem",
              float: "right",
            }}
            variant="outlined"
            size="medium"
            onClick={() => addMoreName()}
          >
            <AddIcon /> Add More
          </Button>
        )}
      </div>

      {isCountryLoaded && (
        <CountryWithPostalCode
          getCountriesData={getCountriesInfo}
          countryCode={userInternationalData.countryCode}
          postalValue={userInternationalData.postalCode}
          cityValue={userInternationalData.city}
          districtValue={userInternationalData.district}
          subDistrictValue={userInternationalData.subDistrict}
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
          label="Address/House No"
          value={userInternationalData.addressLine1}
          onChange={(e) => handleInternationAddress(e)}
          error={isSubmit && !userInternationalData.addressLine1 ? true : false}
          wordLength={40}
          disabled={action !== "addinfo" ? true : false}
        />
        <InputText
          className="p-8"
          size="small"
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
          onChange={(e) => handleInternationAddress(e)}
          required={true}
          error={isSubmit && !userInternationalData.region ? true : false}
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
          zoneCodeValue={userInternationalData.transportZoneCode}
          getTransportData={getTransportInfo}
          isEditable={true}
          isSubmit={isSubmit}
          disabled={action !== "addinfo" ? true : false}
        />
      )}

      <div className="grid grid-cols-2 gap-4 mt-4">
        <InputText
          className="p-8"
          size="small"
          name="internationalSearchTerm_1"
          label="Search Term 1"
          value={userInternationalData.internationalSearchTerm_1}
          onChange={(e) => handleInternationAddress(e)}
          wordLength={240}
          disabled={action !== "addinfo" ? true : false}
        />
        <InputText
          className="p-8"
          size="small"
          name="internationalSearchTerm_2"
          label="Search Term 2"
          value={userInternationalData.internationalSearchTerm_2}
          onChange={(e) => handleInternationAddress(e)}
          wordLength={240}
          disabled={action !== "addinfo" ? true : false}
        />
      </div>
    </div>
  );
}

export default memo(InternationalInfo);
