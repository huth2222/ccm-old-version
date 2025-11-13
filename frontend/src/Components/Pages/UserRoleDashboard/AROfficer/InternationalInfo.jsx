import { TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { memo, useEffect, useState } from "react";
import InputText from "../../../CommonComponent/InputText";

function InternationalInfo({
  jobDataFromStore,
  handleIntnlDataChange,
  inputValue,
  userParsedData,
}) {
  let { action } = useParams();
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
    name: [],
  });

  const extractedData =
    jobDataFromStore?.generalInfomation?.internationalGeneral;

  // setUserDataCollection();

  useEffect(() => {
    setUserInternationalData({
      ...userInternationalData,
      ...extractedData,
    });
  }, [jobDataFromStore]);

  // console.log(userInternationalData);

  return (
    <div>
      <div className="mt-4">
        {userInternationalData.name.map((item, index) => {
          return (
            <div key={index} className="full flex mt-4">
              <TextField
                className="p-8 w-full"
                disabled
                size="small"
                placeholder="Please fill company's name (max 35 Characters)."
                id="name"
                name="name"
                value={item}
                label="Name"
                autoComplete="off"
                inputProps={{ maxLength: 35 }}
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: "#777777",
                    cursor: "not-allowed",
                  },
                }}
              />
            </div>
          );
        })}
      </div>
      <TextField
        className="w-full"
        id="country-select"
        size="small"
        label="Select Country"
        name="country"
        value={userInternationalData.country}
        disabled
        sx={{
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "#777777",
            cursor: "not-allowed",
          },
          marginTop: "1rem",
        }}
      />
      <div className="grid grid-cols-2 gap-4 mt-4">
        <TextField
          className="p-8"
          size="small"
          placeholder="Postal Code or Zip Code"
          id="postalCode"
          name="postalCode"
          label="Postal Code"
          autoComplete="off"
          value={userInternationalData.postalCode}
          disabled
          sx={{
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "#777777",
              cursor: "not-allowed",
            },
          }}
        />
        <TextField
          className="p-8"
          size="small"
          placeholder="City"
          id="city"
          name="city"
          label="City"
          value={userInternationalData.city}
          autoComplete="off"
          disabled
          sx={{
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "#777777",
              cursor: "not-allowed",
            },
          }}
        />
        <TextField
          className="p-8"
          id="district-select"
          size="small"
          label="Select District "
          name="district"
          autoComplete="off"
          value={userInternationalData.district}
          disabled
          sx={{
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "#777777",
              cursor: "not-allowed",
            },
          }}
        />
        <TextField
          className="p-8"
          id="subdistrict-select"
          size="small"
          label="Select Sub District"
          name="subDistrict"
          autoComplete="off"
          value={userInternationalData.subDistrict}
          disabled
          sx={{
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "#777777",
              cursor: "not-allowed",
            },
          }}
        />

        <TextField
          className="p-8"
          size="small"
          placeholder="Enter Your House No."
          id="houseNO"
          name="addressLine1"
          label="Address/House No"
          autoComplete="off"
          inputProps={{ maxLength: 40 }}
          value={userInternationalData.addressLine1}
          disabled
          sx={{
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "#777777",
              cursor: "not-allowed",
            },
          }}
        />
        <TextField
          className="p-8"
          size="small"
          placeholder="Street"
          id="street"
          name="street"
          label="Company's Street"
          autoComplete="off"
          inputProps={{ maxLength: 40 }}
          value={userInternationalData.street}
          disabled
          sx={{
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "#777777",
              cursor: "not-allowed",
            },
          }}
        />
      </div>
      <TextField
        id="region-select"
        size="small"
        className="w-full"
        name="region"
        label="Select Region"
        value={userInternationalData.region}
        disabled
        sx={{
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "#777777",
            cursor: "not-allowed",
          },
          marginTop: "1rem",
        }}
      />

      <TextField
        id="transportZone-select"
        size="small"
        className="w-full"
        value={userInternationalData.transportZone}
        label="Transportation Zone"
        name="transport"
        disabled
        sx={{
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "#777777",
            cursor: "not-allowed",
          },
          marginTop: "1rem",
        }}
      />
      <div className="grid grid-cols-2 gap-4 mt-4">
        {(userParsedData?.role === "Officer" ||
          userParsedData?.role === "Assistant Manager") && (
          <>
            <InputText
              className="p-8"
              name="internationalSearchTerm_1"
              label="Search Term 1"
              onChange={handleIntnlDataChange}
              value={inputValue.internationalSearchTerm_1}
              disabled={
                action === "addinfo" && userParsedData?.role === "Officer"
                  ? false
                  : true
              }
              wordLength={241}
            />
            <InputText
              className="p-8"
              name="internationalSearchTerm_2"
              label="Search Term 2"
              onChange={handleIntnlDataChange}
              value={inputValue.internationalSearchTerm_2}
              disabled={
                action === "addinfo" && userParsedData?.role === "Officer"
                  ? false
                  : true
              }
              wordLength={241}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default memo(InternationalInfo);
